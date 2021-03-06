"use strict";
const request = require("request-promise");
const _ = require("lodash");
const scheduleByCountry = require('./scheduleByCountry.json');
const scheduleBySport = require('./scheduleBySport.json');
const athleteList = require('./athleteList.json');
const lookup = require('country-data').lookup;

module.exports = {
    getAllSchedule: function (query) {
        let listSchedule = [];
        let schedules = {};
        if (query.sport) {
            schedules = scheduleBySport[query.sport].scheduleByDay;
        } else if (query.country) {
            schedules = scheduleByCountry[query.country].scheduleByDay;
        }
        for (let date in schedules) {
            listSchedule = _.concat(listSchedule, schedules[date]);
        }
        listSchedule.sort(function compare(a, b) {
            var dateA = new Date(a.time);
            var dateB = new Date(b.time);
            return dateA - dateB;
        });
        return listSchedule;
    },
    getCountry: function () {
        let country = {};
        for (let c in scheduleByCountry) {
            let data = lookup.countries({ ioc: c })[0];
            let flag = data ? data.emoji : data;
            country[c] = {
                name: scheduleByCountry[c].name,
                flag
            }
        }
        return country;
    },
    getAllAthlete: function () {
        return athleteList;
    },
    getAllAthleteByCountry: function (country) {
        let listCountryAthlete = athleteList[country].countryAthletes;
        return listCountryAthlete;
    },
    getStandings: async function () {
        try {
            const options = {
                method: "GET",
                uri: `https://en.asiangames2018.id/api/mobileapp/device/smartphone/medals/medals_overall`,
                json: true
            };

            const result = await request(options);
            const medals = _.filter(result.Sections, function (e) {
                return e.Type === "content"
            })[0].Items;

            let table = [];
            const countries = this.getCountry();

            for (let country of medals) {
                let medalCount = country.Extensions.MedalCount;
                let flag = countries[country.Title].flag ? countries[country.Title].flag : undefined;
                
                const optSports = {
                    method: "GET",
                    uri: `https://en.asiangames2018.id/api//mobileapp/device/smartphone/medals/country/${country.Title}/medals`,
                    json: true
                };

                const resultSports = await request(optSports);
                const listSports = _.filter(resultSports.Sections, function (e) {
                    return e.Type === "content"
                })[0].Items;

                let sports = _.map(listSports, function (x) {
                    return x.Title;
                });

                table.push({
                    rank: parseInt(medalCount.GoldRank, 10),
                    id: country.Title,
                    name: countries[country.Title].name,
                    flag,
                    gold: parseInt(medalCount.Gold, 10),
                    silver: parseInt(medalCount.Silver, 10),
                    bronze: parseInt(medalCount.Bronze, 10),
                    sports
                });
            }

            return table;
        }
        catch (err) {
            return null;
        }

    }
}