define(['app'], function(app) {
  app.filter('filterPartnerByProject', function () {
      return function (items, id) {

          if (!items)
              return null;
          if (!id)
              return null;

          var result = [];

          for (var i = 0; i < items.length; i++) {
              if (items[i].itemid === id) {
                  result.push(items[i]);
              }
          }

          return result;
      };
  });




    //##################################################################
      app.filter('htmlToPlaintext', function ($filter) {
        return function (text) {

          return  text ? String(text).replace(/<[^>]+>/gm, '') : '';

        };
      });

//##################################################################
  app.filter('filterToUSD', function ($filter) {
    return function (amount, currency) {

        var USDtoEURO = 0.73227;

        if (!amount)
            return 0;

            if (currency === 'Euros' || currency === 'EURO') {
                return amount * (1 / USDtoEURO);
            }
            else {
                return amount;
            }

    };
  });

//##################################################################
  app.filter('getMatchesTotalUSD', function ($filter) {
    return function (matches) {
        var total = 0;

        for (var i = 0; i < matches.length; i++)
            total = total + matches[i].funding;

        return total;
    };
  });

  //##################################################################
  app.filter('filterGetTermComment', function () {
      return function (items, id) {

          if (!items)
              return null;
          if (!id)
              return null;

          for (var i = 0; i < items.length; i++) {
              if (items[i].termid === id) {
                 return items[i].comment;
              }
          }

          return '';
      };
  });





  //##################################################################
  app.filter('filterFPByCountry', function () {
      return function (fps, countrycodes) {

          if (!fps)
              return null;
          if (!countrycodes)
              return null;

          var result = [];


          for (var i = 0; i < fps.length; i++) {
              for (var j = 0; j < countrycodes.length; j++) {
                  if (fps[i].CountryCode === countrycodes[j]) {
                      result.push(fps[i]);
                  }
              }
          }
          return result;
      };
  });


  //##################################################################
  app.filter('filterLeadContactByProject', function () {
      return function (contacts, id) {

          if (!contacts)
              return null;
          if (!id)
              return null;

          var result = [];

          for (var i = 0; i < contacts.length; i++) {
              if (contacts[i].project_id === id && contacts[i].role ==='Lead Contact') {
                  result.push(contacts[i]);
              }
          }

          return result;
      };
  });

  //##################################################################
  app.filter('filterCBDLink', function () {
      return function (url) {

          if (!url)
              return null;

          if (url.substring(0, 11) === '/countries/' || url.substring(0, 5) === '/abs/' || url.substring(0, 11) === '/2011-2020/')
              return 'http://cbd.int' + url;
          else
              return url;

      };
  });




  //##################################################################
  app.filter('filterTake', function () {
      return function (projs, take) {

          if (take === null || projs === null)
              return;

          var result = [];

          for (var i = 0; i < take; i++) {

              result.push(projs[i]);
          }
          return result;
      };
  });

  app.filter('filterArrayCountries', function($http) {
    var countries = [];

    $http.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function(data) {
      countries = data.data;
    });
    return function(arr) {
        if(!arr || !arr.length)
            return '';
        return arr.reduce(function(prev, cur) {
            return prev + countries.find(function(item) { return cur === item.identifier; }).name + ', ';
        }, '').slice(0, -2);
    };
  });

  //##################################################################
  app.filter('filterCountry', function () {
      return function (projs, code) {

          if (!projs)
              return null;


          if (code === null)
              return projs;

          var result = [];
//console.log(projs);
//alert('here');
          for (var i = 0; i < projs.length; i++) {
              for (var j = 0; j < projs[i].country_codes.length; j++) {
                  if (projs[i].country_codes[j] === code) {
                      result.push(projs[i]);
                  }
              }
          }
          return result;
      };
  });

  //##################################################################
  app.filter('filterFundingStatus', function () {
      return function (projs, status) {

          if (!projs)
              return null;

          if (!status || status === '' || status === 'all')
              return projs;

          var result = [];

          for (var i = 0; i < projs.length; i++) {
              if (projs[i].funding_status === status) {
                  result.push(projs[i]);
              }
          }


          return result;

      };
  });



  //##################################################################
  app.filter('filterIsFunded', function () {
      return function (projs, funded) {

          if (!projs)
              return null;

          if (funded === 'all')
              return projs;

          var result = [];

          if (funded === '' || funded === null)
              funded = false;
          else {
              funded = true;
          }


          for (var i = 0; i < projs.length; i++) {
              if (projs[i].is_funded === funded) {
                  result.push(projs[i]);
              }
          }


          return result;

      };
  });


  //##################################################################
  app.filter('filterKeywords', function () {
      return function (projs) {

          if (!projs)
              return null;

          var result = [];

          for (var i = 0; i < projs.length; i++) {
              for (var j = 0; j < projs[i].keywords.length; j++) {

                  result.push(keywords[j]);

              }
          }

          return result;

      };
  });

  app.filter('filterYear2', function() {
    return function(str) {
        var date = new Date(str);
        return date.getFullYear().toString();
    };
  });

  //##################################################################
  app.filter('filterYear', function ($filter) {
    return function (matches, year) {
          if (!matches)
              return null;
          if(!year)
            return matches;

        return matches.filter(function(item) {
            return $filter('filterYear2')(item.startDate_s) === year;
        });
      };
  });
  //##################################################################
  app.filter('filterExpired', function ($filter) {
    return function (matches, status) {
          status=Number(status);
          if (!matches)
              return null;
          if(!status)
              status=false;
          if(status===2)
              return matches;

        return matches.filter(function(item) {
            return item.expired_b === (!!status);
        });
      };
  });

  //##################################################################
  app.filter('filterEcoservices', function () {
      return function (projs, eco) {

          if (!projs)
              return null;

          if (!eco)
              return projs;

          var result = [];

          for (var i = 0; i < projs.length; i++) {
            if(projs[i].ecoservices)
              for (var j = 0; j < projs[i].ecoservices.length; j++) {
                  if (projs[i].ecoservices[j] === eco) {
                      result.push(projs[i]);
                  }
              }
          }

          return result;

      };
  });

  //##################################################################
  app.filter('filterTargets', function () {
      return function (projs, tar) {

          if (!projs || _.isEmpty(projs))
              return null;

          if (tar === null || tar === '')
              return projs;

          var result = [];

          for (var i = 0; i < projs.length; i++) {
             if(_.isArray(projs[i].targets))
              for (var j = 0; j < projs[i].targets.length; j++) {
                  if (projs[i].targets[j] === tar) {
                      result.push(projs[i]);
                  }
              }
          }

          return result;

      };
  });

  app.filter('justProject', function() {
    return function(arr) {
        if(!arr)
            return [];
        return arr.map(function(item) {
            return item.project;
        });
    };
  });

  //##################################################################
  app.filter('filterProjectCountry', function () {
      return function (countryList, pcountries) {

          if (!countryList)
              return null;

          if (!pcountries)
              return countryList;

          var result = [];


          for (var i = 0; i < countryList.length; i++) {
              for (var j = 0; j < pcountries.length; j++) {
                for (var k=0; k < pcountries[j].country_ss.length; k++){


                  if (pcountries[j].country_ss[k] === countryList[i].code) {
                      result.push(countryList[i]);
                  }
                }


              }

          }

          var r = [];
          o: for ( i = 0; i < result.length; i++) {
              for (var x = 0; x < r.length; x++) {
                  if (r[x] === result[i]) {
                      continue o;
                  }
              }
              r[r.length] = result[i];
          }
          return r;



      };
  });

  //##################################################################
  app.filter('filterMatchProjectCountry', function () {
      return function (countryList, pcountries) {
// console.log('pcountries[j].project.country_ss',countryList);
          if (!countryList)
              return null;

          if (!pcountries)
              return countryList;

          var result = [];

//console.log('pr countries? ', pcountries);
          for (var i = 0; i < countryList.length; i++) {
              for (var j = 0; j < pcountries.length; j++) {

                  if (pcountries[j].project.country_ss && pcountries[j].project.country_ss.indexOf(countryList[i].identifier) != -1) {
                      if (!_.find(result,{identifier:countryList[i].identifier}))
                          result.push(countryList[i]);
                  }
              }

          }

          var r = [];
          o: for ( i = 0; i < result.length; i++) {
              for (var x = 0; x < r.length; x++) {
                  if (r[x] === result[i]) {
                      continue o;
                  }
              }
              r[r.length] = result[i];
          }
          return result;



      };
  });

  //##################################################################
  app.filter('filterFunding', function () {
      return function (projs, funding) {

          if (!projs)
              return null;
          funding =Number(funding);

          var i;
          var result = [];

          if (funding === 0) {

              for ( i = 0; i < projs.length; i++) {
                console.log(projs[i].funding_needed);
                  if (projs[i].funding_needed <= 500000) {
                      result.push(projs[i]);
                  }
              }
          }

          if (!funding && _.isEmpty(result))
              return projs;

          if (funding === 500000) {
              for ( i = 0; i < projs.length; i++) {
                  if (projs[i].funding_needed > 500000 && projs[i].funding_needed <= 2500000) {
                      result.push(projs[i]);
                  }
              }
          }

          if (funding === 2500000) {
              for ( i = 0; i < projs.length; i++) {
                  if (projs[i].funding_needed > 2500000 && projs[i].funding_needed <= 10000000) {
                      result.push(projs[i]);
                  }
              }
          }

          if (funding === 10000000) {
              for (i = 0; i < projs.length; i++) {
                  if (projs[i].funding_needed > 10000000) {
                      result.push(projs[i]);
                  }
              }
          }

          return result;

      };
  });

  //##################################################################
  app.filter('filterDonors', function () {
      return function (input, scope) {

          if (!input)
              return null;

          var result = [];

          for (var i = 0; i < input.length; i++) {
              if (input[i].donor) {
                  result.push(input[i]);
              }
          }

          return result;
      };
  });

  //##################################################################
  app.filter('filterMegaDiverse', function () {
      return function (countryList, code) {

          if (!countryList)
              return null;

          var megadiverse = [
             { 'code': 'au' },
             { 'code': 'br' },
             { 'code': 'cn' },
             { 'code': 'co' },
             { 'code': 'cd' },
             { 'code': 'ec' },
             { 'code': 'in' },
             { 'code': 'id' },
             { 'code': 'mg' },
             { 'code': 'my' },
             { 'code': 'mx' },
             { 'code': 'pg' },
             { 'code': 'pe' },
             { 'code': 'ph' },
             { 'code': 'za' },
             { 'code': 'us' },
             { 'code': 've' }
          ];

          var result = [];

          for (var i = 0; i < countryList.length; i++) {
              for (var j = 0; j < megadiverse.length; j++) {
                  if (countryList[i].code === megadiverse[j].code) {
                      result.push(countryList[i]);
                  }
              }
          }

          return result;
      };
  });

  //##################################################################
  app.filter('filterLCD', function () {
      return function (countryList, code) {

          if (!countryList)
              return null;

          var megadiverse = [
             { 'code': 'ao', 'region': 'africa' },
             { 'code': 'bj', 'region': 'africa' },
             { 'code': 'bf', 'region': 'africa' },
             { 'code': 'bi', 'region': 'africa' },
             { 'code': 'cf', 'region': 'africa' },
             { 'code': 'td', 'region': 'africa' },
             { 'code': 'km', 'region': 'africa' },
             { 'code': 'cd', 'region': 'africa' },
             { 'code': 'dj', 'region': 'africa' },
             { 'code': 'gq', 'region': 'africa' },
             { 'code': 'er', 'region': 'africa' },
             { 'code': 'et', 'region': 'africa' },
             { 'code': 'gm', 'region': 'africa' },
             { 'code': 'gn', 'region': 'africa' },
             { 'code': 'gw', 'region': 'africa' },
             { 'code': 'ls', 'region': 'africa' },
             { 'code': 'lr', 'region': 'africa' },
             { 'code': 'mg', 'region': 'africa' },
             { 'code': 'mw', 'region': 'africa' },
             { 'code': 'ml', 'region': 'africa' },
             { 'code': 'mu', 'region': 'africa' },
             { 'code': 'mz', 'region': 'africa' },
             { 'code': 'ne', 'region': 'africa' },
             { 'code': 'rw', 'region': 'africa' },
             { 'code': 'st', 'region': 'africa' },
             { 'code': 'sn', 'region': 'africa' },
             { 'code': 'sl', 'region': 'africa' },
             { 'code': 'so', 'region': 'africa' },
             { 'code': 'sd', 'region': 'africa' },
             { 'code': 'tg', 'region': 'africa' },
             { 'code': 'tz', 'region': 'africa' },
             { 'code': 'ug', 'region': 'africa' },
             { 'code': 'zm', 'region': 'africa' },
             { 'code': 'af', 'region': 'asia-pacific' },
             { 'code': 'bt', 'region': 'asia-pacific' },
             { 'code': 'bd', 'region': 'asia-pacific' },
             { 'code': 'kh', 'region': 'asia-pacific' },
             { 'code': 'tl', 'region': 'asia-pacific' },
             { 'code': 'ki', 'region': 'asia-pacific' },
             { 'code': 'la', 'region': 'asia-pacific' },
             { 'code': 'mm', 'region': 'asia-pacific' },
             { 'code': 'np', 'region': 'asia-pacific' },
             { 'code': 'ws', 'region': 'asia-pacific' },
             { 'code': 'si', 'region': 'asia-pacific' },
             { 'code': 'tv', 'region': 'asia-pacific' },
             { 'code': 'vu', 'region': 'asia-pacific' },
             { 'code': 'ye', 'region': 'asia-pacific' },
             { 'code': 'ht', 'region': 'americas' }

          ];

          var result = [];

          for (var i = 0; i < countryList.length; i++) {
              for (var j = 0; j < megadiverse.length; j++) {
                  if (countryList[i].code === megadiverse[j].code) {
                      result.push(countryList[i]);
                  }
              }
          }

          return result;
      };
  });

  //##################################################################
  app.filter('filterSIDS', function () {
      return function (countryList, code, region) {

          if (!countryList)
              return null;

          var sids = [
             { 'code': 'ai', 'region': 'caribbean' },
             { 'code': 'ag', 'region': 'caribbean' },
             { 'code': 'bs', 'region': 'caribbean' },
             { 'code': 'bb', 'region': 'caribbean' },
             { 'code': 'bz', 'region': 'caribbean' },
             { 'code': 'vg', 'region': 'caribbean' },
             { 'code': 'cu', 'region': 'caribbean' },
             { 'code': 'dm', 'region': 'caribbean' },
             { 'code': 'do', 'region': 'caribbean' },
             { 'code': 'gd', 'region': 'caribbean' },
             { 'code': 'gy', 'region': 'caribbean' },
             { 'code': 'ht', 'region': 'caribbean' },
             { 'code': 'jm', 'region': 'caribbean' },
             { 'code': 'ms', 'region': 'caribbean' },
             { 'code': 'an', 'region': 'caribbean' },
             { 'code': 'pr', 'region': 'caribbean' },
             { 'code': 'kn', 'region': 'caribbean' },
             { 'code': 'lc', 'region': 'caribbean' },
             { 'code': 'vc', 'region': 'caribbean' },
             { 'code': 'sr', 'region': 'caribbean' },
             { 'code': 'tt', 'region': 'caribbean' },
             { 'code': 'um', 'region': 'caribbean' },
             { 'code': 'as', 'region': 'pacific' },
             { 'code': 'ck', 'region': 'pacific' },
             { 'code': 'fm', 'region': 'pacific' },
             { 'code': 'fj', 'region': 'pacific' },
             { 'code': 'pf', 'region': 'pacific' },
             { 'code': 'gu', 'region': 'pacific' },
             { 'code': 'ki', 'region': 'pacific' },
             { 'code': 'mh', 'region': 'pacific' },
             { 'code': 'nr', 'region': 'pacific' },
             { 'code': 'nc', 'region': 'pacific' },
             { 'code': 'nu', 'region': 'pacific' },
             { 'code': 'mp', 'region': 'pacific' },
             { 'code': 'pw', 'region': 'pacific' },
             { 'code': 'pg', 'region': 'pacific' },
             { 'code': 'ws', 'region': 'pacific' },
             { 'code': 'sb', 'region': 'pacific' },
             { 'code': 'tp', 'region': 'pacific' },
             { 'code': 'to', 'region': 'pacific' },
             { 'code': 'tv', 'region': 'pacific' },
             { 'code': 'vu', 'region': 'pacific' },
             { 'code': 'bh', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' },
             { 'code': 'cv', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' },
             { 'code': 'km', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' },
             { 'code': 'gw', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' },
             { 'code': 'mv', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' },
             { 'code': 'mr', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' },
             { 'code': 'st', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' },
             { 'code': 'sc', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' },
             { 'code': 'sg', 'region': 'africa, indian ocean, mediterranean, and south china sea (aims)' }
          ];

          var result = [];

          for (var i = 0; i < countryList.length; i++) {
              for (var j = 0; j < sids.length; j++) {
                  if (countryList[i].code === sids[j].code && region === sids[j].region) {
                      result.push(countryList[i]);
                  }
              }
          }

          return result;
      };
  });


  //##################################################################
  app.filter('filterLLDCs', function () {
      return function (countryList, code) {

          if (!countryList)
              return null;

          var megadiverse = [
             { 'code': 'bw', 'region': 'africa' },
             { 'code': 'bf', 'region': 'africa' },
             { 'code': 'bi', 'region': 'africa' },
             { 'code': 'cf', 'region': 'africa' },
             { 'code': 'td', 'region': 'africa' },
             { 'code': 'et', 'region': 'africa' },
             { 'code': 'ls', 'region': 'africa' },
             { 'code': 'mw', 'region': 'africa' },
             { 'code': 'ml', 'region': 'africa' },
             { 'code': 'ne', 'region': 'africa' },
             { 'code': 'rw', 'region': 'africa' },
             { 'code': 'ss', 'region': 'africa' },
             { 'code': 'sz', 'region': 'africa' },
             { 'code': 'ug', 'region': 'africa' },
             { 'code': 'zm', 'region': 'africa' },
             { 'code': 'zw', 'region': 'africa' },
             { 'code': 'af', 'region': 'asia' },
             { 'code': 'bt', 'region': 'asia' },
             { 'code': 'kz', 'region': 'asia' },
             { 'code': 'kg', 'region': 'asia' },
             { 'code': 'la', 'region': 'asia' },
             { 'code': 'mn', 'region': 'asia' },
             { 'code': 'np', 'region': 'asia' },
             { 'code': 'tj', 'region': 'asia' },
             { 'code': 'tm', 'region': 'asia' },
             { 'code': 'uz', 'region': 'asia' },
             { 'code': 'am', 'region': 'europe' },
             { 'code': 'az', 'region': 'europe' },
             { 'code': 'mk', 'region': 'europe' },
             { 'code': 'md', 'region': 'europe' },
             { 'code': 'bo', 'region': 'south america' },
             { 'code': 'py', 'region': 'south america' },
          ];

          var result = [];

          for (var i = 0; i < countryList.length; i++) {
              for (var j = 0; j < megadiverse.length; j++) {
                  if (countryList[i].code === megadiverse[j].code) {
                      result.push(countryList[i]);
                  }
              }
          }

          return result;
      };
  });

  //##################################################################
  app.filter('filterLLDCs', function () {
      return function (countryList, code) {

          if (!countryList)
              return null;

          var megadiverse = [
             { 'code': 'bw', 'region': 'africa' },
             { 'code': 'bf', 'region': 'africa' },
             { 'code': 'bi', 'region': 'africa' },
             { 'code': 'cf', 'region': 'africa' },
             { 'code': 'td', 'region': 'africa' },
             { 'code': 'et', 'region': 'africa' },
             { 'code': 'ls', 'region': 'africa' },
             { 'code': 'mw', 'region': 'africa' },
             { 'code': 'ml', 'region': 'africa' },
             { 'code': 'ne', 'region': 'africa' },
             { 'code': 'rw', 'region': 'africa' },
             { 'code': 'ss', 'region': 'africa' },
             { 'code': 'sz', 'region': 'africa' },
             { 'code': 'ug', 'region': 'africa' },
             { 'code': 'zm', 'region': 'africa' },
             { 'code': 'zw', 'region': 'africa' },
             { 'code': 'af', 'region': 'asia' },
             { 'code': 'bt', 'region': 'asia' },
             { 'code': 'kz', 'region': 'asia' },
             { 'code': 'kg', 'region': 'asia' },
             { 'code': 'la', 'region': 'asia' },
             { 'code': 'mn', 'region': 'asia' },
             { 'code': 'np', 'region': 'asia' },
             { 'code': 'tj', 'region': 'asia' },
             { 'code': 'tm', 'region': 'asia' },
             { 'code': 'uz', 'region': 'asia' },
             { 'code': 'am', 'region': 'europe' },
             { 'code': 'az', 'region': 'europe' },
             { 'code': 'mk', 'region': 'europe' },
             { 'code': 'md', 'region': 'europe' },
             { 'code': 'bo', 'region': 'south america' },
             { 'code': 'py', 'region': 'south america' },
          ];

          var result = [];

          for (var i = 0; i < countryList.length; i++) {
              for (var j = 0; j < megadiverse.length; j++) {
                  if (countryList[i].code === megadiverse[j].code) {
                      result.push(countryList[i]);
                  }
              }
          }

          return result;
      };
  });







  //##################################################################
  app.filter('truncate', function () {
      return function (text, length, end) {


          if (!text)
              return null;

          if (isNaN(length))
              length = 10;

          if (end === undefined)
              end = '...';

          if (text.length <= length || text.length - end.length <= length) {
              return text + end;
          }
          else {
              return String(text).substring(0, length - end.length) + end;
          }

      };
  });

  //MATCHES ##################################################################

  //##################################################################
  app.filter('filterMatchFunding', function () {
      return function (matches, funding) {

          if (!matches)
              return null;

          if (funding === null || funding === '')
              return matches;

          var result = [];

          if (funding === 0) {
              for (var i = 0; i < matches.length; i++) {
                  if (matches[i].amount <= 500000) {
                      result.push(matches[i]);
                  }
              }
          }

          if (funding === 500000) {
              for (var i = 0; i < matches.length; i++) {
                  if (matches[i].amount > 500000 && matches[i].amount <= 2500000) {
                      result.push(matches[i]);
                  }
              }
          }

          if (funding === 2500000) {
              for (var i = 0; i < matches.length; i++) {
                  if (matches[i].amount > 2500000 && matches[i].amount <= 10000000) {
                      result.push(matches[i]);
                  }
              }
          }

          if (funding === 10000000) {
              for (var i = 0; i < matches.length; i++) {
                  if (matches[i].amount > 10000000) {
                      result.push(matches[i]);
                  }
              }
          }

          return result;

      }
  });

  //##################################################################
  app.filter('filterMatchYear', function ($filter) {
      return function (matches, year) {
          if (!matches)
              return null;
          if(!year)
            return matches;

        return matches.filter(function(item) {
            return Number($filter('filterYear2')(item.donationDate_ss)) === Number(year);
        });
      }
  });

    //##################################################################
  app.filter('filterPrevFunded', function ($filter) {
      return function (matches, prevFunded) {
          if (!matches)
              return null;
          if(prevFunded===undefined)
            prevFunded=0;
          //  return matches;

        return matches.filter(function(item) {
            return item.lifewebPrevFunded_ss === prevFunded;
        });
      }
  });

  //##################################################################
  app.filter('filterMatchIsFunded', function () {
      return function (matches, funded) {

          if (!matches)
              return null;

          if (funded === null || funded === '')
              return matches;

          var result = [];

          if (funded === 'false')
              funded = false;
          else {
              funded = true;
          }

          for (var i = 0; i < matches.length; i++) {
              if (matches[i].project.is_funded === funded) {
                  result.push(matches[i]);
              }
          }

          return result;

      }
  });
  //##################################################################
  app.filter('filterMatchLifeWebbed', function () {
      return function (matches, flag) {

          if (!matches)
              return null;

          if (flag === null || flag === '')
              return matches;

          var result = [];

          if (flag === 'false')
              flag = false;
          else
              flag = true;


          for (var i = 0; i < matches.length; i++) {
              if (matches[i].lw_facilitated === flag) {
                  result.push(matches[i]);
              }
          }

          return result;

      }
  });

    app.filter('uniqueDonor', function() {
        return function(matches) {
//console.log('matches? ', matches);
            if(!matches)
                return [];
            matches.filter(function(item, index) {
                return !matches.find(function(findItem, findIndex) {
                    return item.donor.identifier_s === findItem.donor.identifier_s && index != findIndex;
                });
            });
        };
    });

  //##################################################################
  app.filter('filterMatchCountry', function () {
      return function (arr, country) {
          if (!arr)
              return null;
          if(!country)
            return arr;

          return arr.filter(function(item) {
            return item.project.country_ss.indexOf(country) != -1;
          });
      };
  });


  //##################################################################
  app.filter('filterMatchDonor', function () {
      return function (arr, donor) {
          if (!arr)
              return null;
          if(!donor)
            return arr;

          return arr.filter(function(item) {
            return item.donor.identifier_s === donor;
          });
      }
  });


  //##################################################################
  app.filter('filterGetTargetInfo', function () {
      return function (target) {

          if (!target)
              return null;

          var targets = [
             { 'name': 'AICHI-TARGET-01', 'icon': '/app/lifeweb/images/targets/01.png', 'desc': 'By 2020, at the latest, people are aware of the values of biodiversity and the steps they can take to conserve and use it sustainably.' },
            { 'name': 'AICHI-TARGET-02', 'icon': '/app/lifeweb/images/targets/02.png', 'desc': 'By 2020, at the latest, biodiversity values have been integrated into national and local development and poverty reduction strategies and planning processes and are being incorporated into national accounting, as appropriate, and reporting systems' },
             { 'name': 'AICHI-TARGET-03', 'icon': '/app/lifeweb/images/targets/03.png', 'desc': 'By 2020, at the latest, incentives, including subsidies, harmful to biodiversity are eliminated, phased out or reformed in order to minimize or avoid negative impacts, and positive incentives for the conservation and sustainable use of biodiversity are developed and applied, consistent and in harmony with the Convention and other relevant international obligations, taking into account national socio economic conditions.' },
             { 'name': 'AICHI-TARGET-04', 'icon': '/app/lifeweb/images/targets/04.png', 'desc': 'By 2020, at the latest, Governments, business and stakeholders at all levels have taken steps to achieve or have implemented plans for sustainable production and consumption and have kept the impacts of use of natural resources well within safe ecological limits.' },
             { 'name': 'AICHI-TARGET-05', 'icon': '/app/lifeweb/images/targets/05.png', 'desc': 'By 2020, the rate of loss of all natural habitats, including forests, is at least halved and where feasible brought close to zero, and degradation and fragmentation is significantly reduced.' },
             { 'name': 'AICHI-TARGET-06', 'icon': '/app/lifeweb/images/targets/06.png', 'desc': 'By 2020 areas under agriculture, aquaculture and forestry are managed sustainably, ensuring conservation of biodiversity.' },
             { 'name': 'AICHI-TARGET-08', 'icon': '/app/lifeweb/images/targets/08.png', 'desc': 'By 2020, pollution, including from excess nutrients, has been brought to levels that are not detrimental to ecosystem function and biodiversity.' },
             { 'name': 'AICHI-TARGET-09', 'icon': '/app/lifeweb/images/targets/09.png', 'desc': 'By 2020, invasive alien species and pathways are identified and prioritized, priority species are controlled or eradicated, and measures are in place to manage pathways to prevent their introduction and establishment.' },
             { 'name': 'AICHI-TARGET-10', 'icon': '/app/lifeweb/images/targets/10.png', 'desc': 'By 2015, the multiple anthropogenic pressures on coral reefs, and other vulnerable ecosystems impacted by climate change or ocean acidification are minimized, so as to maintain their integrity and functioning.' },
             { 'name': 'AICHI-TARGET-11', 'icon': '/app/lifeweb/images/targets/11.png', 'desc': 'By 2020, at least 17 per cent of terrestrial and inland water, and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscapes and seascapes.' },
             { 'name': 'AICHI-TARGET-12', 'icon': '/app/lifeweb/images/targets/12.png', 'desc': 'By 2020 the extinction of known threatened species has been prevented and their conservation status, particularly of those most in decline, has been improved and sustained.' },
             { 'name': 'AICHI-TARGET-13', 'icon': '/app/lifeweb/images/targets/13.png', 'desc': 'By 2020, the genetic diversity of cultivated plants and farmed and domesticated animals and of wild relatives, including other socio-economically as well as culturally valuable species, is maintained, and strategies have been developed and implemented for minimizing genetic erosion and safeguarding their genetic diversity.' },
             { 'name': 'AICHI-TARGET-14', 'icon': '/app/lifeweb/images/targets/14.png', 'desc': 'By 2020, ecosystems that provide essential services, including services related to water, and contribute to health, livelihoods and well-being, are restored and safeguarded, taking into account the needs of women, indigenous and local communities, and the poor and vulnerable.' },
             { 'name': 'AICHI-TARGET-15', 'icon': '/app/lifeweb/images/targets/15.png', 'desc': 'By 2020, ecosystem resilience and the contribution of biodiversity to carbon stocks has been enhanced, through conservation and restoration, including restoration of at least 15 per cent of degraded ecosystems, thereby contributing to climate change mitigation and adaptation and to combating desertification.' },
             { 'name': 'AICHI-TARGET-16', 'icon': '/app/lifeweb/images/targets/16.png', 'desc': 'By 2015, the Nagoya Protocol on Access to Genetic Resources and the Fair and Equitable Sharing of Benefits Arising from their Utilization is in force and operational, consistent with national legislation.' },
             { 'name': 'AICHI-TARGET-17', 'icon': '/app/lifeweb/images/targets/17.png', 'desc': 'By 2015 each Party has developed, adopted as a policy instrument, and has commenced implementing an effective, participatory and updated national biodiversity strategy and action plan.' },
             { 'name': 'AICHI-TARGET-18', 'icon': '/app/lifeweb/images/targets/18.png', 'desc': 'By 2020, the traditional knowledge, innovations and practices of indigenous and local communities relevant for the conservation and sustainable use of biodiversity, and their customary use of biological resources, are respected, subject to national legislation and relevant international obligations, and fully integrated and reflected in the implementation of the Convention with the full and effective participation of indigenous and local communities, at all relevant levels.' },
             { 'name': 'AICHI-TARGET-19', 'icon': '/app/lifeweb/images/targets/19.png', 'desc': 'By 2020, knowledge, the science base and technologies relating to biodiversity, its values, functioning, status and trends, and the consequences of its loss, are improved, widely shared and transferred, and applied.' },
             { 'name': 'AICHI-TARGET-20', 'icon': '/app/lifeweb/images/targets/20.png', 'desc': 'By 2020, at the latest, the mobilization of financial resources for effectively implementing the Strategic Plan for Biodiversity 2011-2020 from all sources, and in accordance with the consolidated and agreed process in the Strategy for Resource Mobilization, should increase substantially from the current levels. This target will be subject to changes contingent to resource needs assessments to be developed and reported by Parties.' }
          ];
//console.log('aichi traget: ', target);

          var result = [];
          for (var i = 0; i < targets.length; ++i)
              if (targets[i].name === target)
                  return targets[i];

          return false;
      }
  });



  //##################################################################
  app.filter('filterGetEcoservices', function () {
      return function (termid) {

          if (!termid)
              return null;

          var ecoservices = [
             { 'name': 'ecoservices1', 'icon': '/app/lifeweb/images/ecoservices/ecoservices1_small.png', 'desc': 'Climate Change Mitigation' },
             { 'name': 'ecoservices2', 'icon': '/app/lifeweb/images/ecoservices/ecoservices2_small.png', 'desc': 'Climate Change Adaptation' },
             { 'name': 'ecoservices3', 'icon': '/app/lifeweb/images/ecoservices/ecoservices3_small.png', 'desc': 'Freshwater Security' },
             { 'name': 'ecoservices4', 'icon': '/app/lifeweb/images/ecoservices/ecoservices4_small.png', 'desc': 'Food Security' },
             { 'name': 'ecoservices5', 'icon': '/app/lifeweb/images/ecoservices/ecoservices5_small.png', 'desc': 'Human Health' },
             { 'name': 'ecoservices6', 'icon': '/app/lifeweb/images/ecoservices/ecoservices6_small.png', 'desc': 'Cultural and Spiritual Access' },
             { 'name': 'ecoservices7', 'icon': '/app/lifeweb/images/ecoservices/ecoservices7_small.png', 'desc': 'Income Generation' }
          ];

          var result = [];

          for (var i = 0; i < ecoservices.length; i++) {
              if (ecoservices[i].name === termid) {
                  return ecoservices[i];
              }
          }

          return result;
      }
  });


  //##################################################################
  app.filter('filterTotalSecured', function () {
      return function (donors) {

          if (!donors)
              return null;

          var total = 0;

          for (var i = 0; i < donors.length; i++) {
              if (donors[i].lifeweb_facilitated)
                  total = total + donors[i].funding;
          }

          return total;

      }
  });

  //##################################################################
  app.filter('filterTotalExpected', function () {
      return function (donors) {

          if (!donors)
              return null;

          var total = 0;

          for (var i = 0; i < donors.length; i++) {
              if (!donors[i].lifeweb_facilitated)
                  total = total + donors[i].funding;
          }

          return total;

      }
  });


  //##################################################################
  app.filter('filterDate', function ($filter) {
      return function (d) {
          if (!d)
              return null;

          var d1 = d;
          if(d.indexOf('Date') != -1) {
              d1 = d.replace('/Date(', '');
              d1 = Number(d1.replace(')/', ''));
          }
          return $filter('date')(new Date(d1), 'dd MMM yyyy');
      }
  });


  //##################################################################
  app.filter('SumAmount', function ($filter) {
      return function (funding, selected_currency) {

          var USDtoEURO = 0.73500;

          if (!funding)
              return null;

          if (!selected_currency)
              selected_currency = 'EURO';

          var total = 0;
          var amount = 0;

          //convert all to Euros and sum
          for (var i = 0; i < funding.length; i++) {
              amount = funding[i].amount * USDtoEURO;
              total = total + amount;
          }

          if (selected_currency === 'EURO') {
              total = $filter('number')(total, 0);
              return '\u20AC' + total;
          }
          else {
              total = total * (1/USDtoEURO)
              total = $filter('number')(total, 0);
              return '\$' + total;
          }

      }
  });

  //##################################################################
  app.filter('YearRange', function ($filter) {
      return function (funding) {

        var year,low,high=0;

        _.each(funding,function(donation){
            year = Number(new Date(donation.donationDate_ss).getFullYear());
            if(!low || low && (year < low))    low= year;
            if(!high || high && (year > high)) high= year;
        });

        if(low===high)
          return low;
        else if(!low || !high)
          return   '2008 - ' + new Date().getFullYear();
        else
          return  low+ ' - ' + high;

      };
  });

  //##################################################################
  app.filter('CountCountries', function ($filter) {
      return function (funding) {

          if (!funding)
              return null;
          var c = [];
          var flag = false;

          for (var i = 0; i < funding.length; i++) {
              for (var k = 0; k < funding[i].project.country_codes.length; k++) {
                  for (var j = 0; j < c.length; j++) {

                      if (c[j] === funding[i].project.country_codes[k])
                          flag = true;

                  }
                  if (!flag) {

                      c.push(funding[i].project.country_codes[k]);
                  }
                  flag = false;
              }
          }

          return c.length;

      }
  });


  //##################################################################
  app.filter('DistinctCountries', function () {
      return function (matches) {
          if (!matches)
              return 0;

          var keys = {};
          var countries=[];
          var n = [];
          _.each(matches,function(match){
              countries = _.union(countries,match.country_ss);
              for(var i = 0; i < countries.length; i++)
              {
                if (n.indexOf(countries[i]) === -1) n.push(countries[i]);
              }
              countries = n;

          });
          return countries.length;
      }
  });

  app.filter('uniqueDonorsFromProjects', function() {
    //return array of {label: key: }
    return function(projects) {
        return [];
    /*
        return projects.reduce(function(prev, item) {
            return prev.concat(item.donor_ss.map(function(item) {
                return {title: item};
            });
        }, []);
        */
    };
  });

  //##################################################################
  app.filter('DistinctDonors', function ($filter) {
      return function (funding) {

          if (!funding)
              return null;

          var c = [];
          var flag = false;

          for (var i = 0; i < funding.length; i++) {

              var value = funding[i].donor.name;
              var key = funding[i].donor.id;

                  for (var j = 0; j < c.length; j++) {

                      if (c[j].key === key)
                          flag = true;
                  }
                  if (flag === false) {
                      c.push({ 'key': key, 'value': value });
                  }
                  flag = false;
          }

          return $filter('orderBy')(c, 'key', true);

      }
  });


  //##################################################################
  app.filter('filterCurrency', function ($filter) {
      return function (amount, currency, selected_currency) {

          var USDtoEURO = 0.90;

          var exchange = '';

          if (!amount || amount <= 0) {
              return '';
          }

          if (selected_currency === 'USD') {

              if (currency === 'Euros') {
                  amount = amount * (1 / USDtoEURO);
                  amount = $filter('number')(amount, 0);
                  exchange = '$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');// + ' USD'
              }
              else {
                  amount = $filter('number')(amount, 0);
                  exchange = '$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');// + ' USD'
              }
          }

          if (selected_currency === 'EURO') {

              if (currency === 'US Dollars') {
                  amount = amount * USDtoEURO;
                  amount = $filter('number')(amount, 0);
                  exchange = '\u20AC' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');// + ' EUROS'
              }
              else {
                  amount = $filter('number')(amount, 0);
                  exchange = '\u20AC' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');// + ' EUROS'
              }
          }

          if (!selected_currency) {

              if (currency === 'US Dollars') {
                  exchange = '$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' USD'
              }
              if (currency === 'Euros') {
                  exchange = '\u20AC' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' EUROS'
              }
          }


          if (!amount || amount <= 0) {
              return '';
          }

          return exchange;

      };
  });

  //COUNTRY FILTERS...
  //TODO: put in it's own file or something... this file contains WAY too many filters.

    app.filter('filterCountryName', function($filter) {
        return function(countries, id) {

            if (countries === null)
                return null;

        var result='test';

        for (var i = 0; i < countries.length; i++) {

            if (countries[i].code === id) {
                result = countries[i].name; break;
                  }
            }

          return result;
        }
    });

    //##################################################################
    app.filter('filterIsFunded', function() {
        return function(projs, funded) {

            if (projs === null)
                return null;

      if(funded === 'all')
        return projs;

      var result= [];

        if(funded === '' || funded === null)
          funded = false;
          else{
          funded = true;
          }


          for (var i=0; i < projs.length; i++){
            if (projs[i].is_funded === funded) {
              result.push(projs[i]);
            }
          }


            return result;

        };
    });

    //##################################################################
    app.filter('filterCountry', function() {
        return function(projs, code) {


           if(!code)
               return projs;

           if (!projs)
               return projs;

            var result= [];

            if(_.isArray(projs))
            for (var i=0; i < projs.length; i++){

                for (var k=0; k < projs[i].country_ss.length; k++){
                  if (projs[i].country_ss[k] === code) {
                      result.push(projs[i]);
                  }
                }


            }


            return result;
        }
    });
    return true;
});
