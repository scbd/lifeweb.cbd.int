define(['app','/app/js/services/common.js'], function (app) {

//TODO: put somewhere common
//TODO: i gutted IWorkflows and realm, so currently publishRequest isn't going to work.
app.factory("editFormUtility", ["IStorage", "$q","commonjs",'realm', function(storage, $q, commonjs,realm) {

	var schemasWorkflowTypes  = {

		"absPermit"					: { name : "publishNationalRecord", version : "0.4" },
		"absCheckpoint"				: { name : "publishNationalRecord", version : "0.4" },
		"absCheckpointCommunique"	: { name : "publishNationalRecord", version : "0.4" },
		"authority"					: { name : "publishNationalRecord", version : "0.4" },
		"measure"					: { name : "publishNationalRecord", version : "0.4" },
		"database"					: { name : "publishNationalRecord", version : "0.4" },

		"resource"					: { name : "publishReferenceRecord", version : undefined }
	};

	var _self = {

		//==================================
		//
		//==================================
		load: function(identifier, expectedSchema) {

			return storage.drafts.get(identifier, { info: "" }).then(
				function(success) {
					return success;
				},
				function(error) {
					if (error.status == 404 || error.status == 401)
						return storage.documents.get(identifier, { info: "" });
					throw error;
				}).then(
				function(success) {
					var info = success.data;

					if (expectedSchema && info.type!=expectedSchema)
						throw { data: { error: "Invalid schema type" }, status:"badSchema"};

					var hasDraft = !!info.workingDocumentCreatedOn;
					//var securityPromise = hasDraft ? storage.drafts.security.canUpdate(info.identifier, info.type)
					//							   : storage.drafts.security.canCreate(info.identifier, info.type);

					//return securityPromise.then(
					//	function(isAllowed) {
					//		if (!isAllowed && !commonjs.isIAC())
					//			throw { data: { error: "Not allowed" }, status: "notAuthorized" };

							var documentPromise = hasDraft ? storage.drafts.get(identifier)
														   : storage.documents.get(identifier);

							return documentPromise.then(
								function(success) {
									return success.data;
								});
					//	});
				});
		},

		//==================================
		//
		//==================================
		draftExists: function(identifier) {

			return storage.drafts.get(identifier, { info: "" }).then(function() {
				return true;
			},function(error) {
				if (error.status == 404)
					return false;
				throw error;
			});
		},

		//==================================
		//
		//==================================
		saveDraft: function(document) {
      //TODO: this version is now more up to date because it returns a promise that ensures everything has actually completed.
      //Currently, you would have to go two promises deep to get to the real result from the return. Ie. saveDraft().then(function(result) { result.then(function(result) { result.then(function(result) { console.log('real result: ', result); }); }); });
      //further, in the resulting promise, the saveDraft operation is likely not complete yet... hence the nested promises, even though you may think it is complete.
      //This version, the returned value is a promise whos result is the result of the put call. or similar if error.

      var deferred = $q.defer();
			var identifier = document.header.identifier;
//			var schema     = document.header.schema;
			var metadata   = {};

			if (document.government)
				metadata.government = document.government.identifier;

			_self.draftExists(identifier).then(function(hasDraft) {
				var securityPromise = hasDraft ? storage.drafts.security.canUpdate(identifier, document.header.schema, metadata)
											   : storage.drafts.security.canCreate(identifier, document.header.schema, metadata);

				securityPromise.then(function(isAllowed) {
					if (!isAllowed)
						throw { error: "Not authorized to save draft" };

                    //NOTE: CBD's rest services do everything by put? Confusing...
                    //      normally you'd use post for creation, and put for editing.
					storage.drafts.put(identifier, document).then(function(result) {
                        deferred.resolve(result); //THIS is the resolution of the promise we return.
                    });
				});
			});

        return deferred.promise;
		},

		//==================================
		//
		//==================================
		documentExists: function(identifier) {

			return storage.documents.get(identifier, { info: "" }).then(function() {
				return true;
			},function(error) {
				if (error.status == 404)
					return false;
				throw error;
			});
		},

		//==================================
		//
		//==================================
		publish: function(document) {

			var identifier = document.header.identifier;
			var schema     = document.header.schema;
			var metadata   = {};

			if (document.government)
				metadata.government = document.government.identifier;

			// Check if document exists

			return _self.documentExists(identifier).then(function(exists) {

				// Check user security on document

				var qCanWrite = exists ? storage.documents.security.canUpdate(identifier, schema, metadata)
									   : storage.documents.security.canCreate(identifier, schema, metadata);

				return qCanWrite;

			}).then(function(canWrite) {

				if(!canWrite)
					throw { error : "Not allowed" };

				//Save document

				return storage.documents.put(identifier, document);	// return documentInfo
			});
		},

		//==================================
		//
		//==================================
		publishRequest: function(document) {

			var identifier = document.header.identifier;
			var schema     = document.header.schema;
			var metadata   = {};

			if (document.government)
				metadata.government = document.government.identifier;

			// Check if doc & draft exists

			return _self.draftExists(identifier).then(function(exists) {

				// Check user security on drafts

				var qCanWrite = exists ? storage.drafts.security.canUpdate(identifier, schema, metadata)
									   : storage.drafts.security.canCreate(identifier, schema, metadata);

				return qCanWrite;

			}).then(function(canWrite) {

				if(!canWrite)
					throw { error : "Not allowed" };

				//Save draft
				return storage.drafts.put(identifier, document);

			}).then(function(draftInfo) {

				var type = schemasWorkflowTypes[draftInfo.type];

				if(!type)
					throw "No workflow type defined for this record type: " + draftInfo.type;

				var workflowData = {
					"realm"      : realm,
					"documentID" : draftInfo.documentID,
					"identifier" : draftInfo.identifier,
					"title"      : draftInfo.workingDocumentTitle,
					"abstract"   : draftInfo.workingDocumentSummary,
					"metadata"   : draftInfo.workingDocumentMetadata
				};

				return workflows.create(type.name, type.version, workflowData); // return workflow info
			});
		}
	};

	return _self;

}]);
});
