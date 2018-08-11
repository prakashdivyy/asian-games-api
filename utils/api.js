"use strict";
const request = require("request-promise");
const _ = require("lodash");

const language = ["en", "id"];

const sports = {
    archery: { title: 'Archery', id: 'ar' },
    artistic_gymnastics: { title: 'Artistic Gymnastics', id: 'ga' },
    artistic_swimming: { title: 'Artistic Swimming', id: 'sy' },
    athletics: { title: 'Athletics', id: 'at' },
    badminton: { title: 'Badminton', id: 'bd' },
    baseball: { title: 'Baseball', id: 'bb' },
    basketball: { title: 'Basketball', id: 'bk' },
    basketball_3x3: { title: 'Basketball 3x3', id: 'b3' },
    beach_volleyball: { title: 'Beach Volleyball', id: 'bv' },
    bowling: { title: 'Bowling', id: 'bo' },
    boxing: { title: 'Boxing', id: 'bx' },
    bridge: { title: 'Bridge', id: 'br' },
    canoe_kayak_slalom: { title: 'Canoe/Kayak Slalom', id: 'cs' },
    canoe_kayak_sprint: { title: 'Canoe/Kayak Sprint', id: 'cf' },
    cycling_bmx: { title: 'Cycling BMX', id: 'cb' },
    cycling_mountain_bike: { title: 'Cycling Mountain Bike', id: 'cm' },
    cycling_road: { title: 'Cycling Road', id: 'cr' },
    cycling_track: { title: 'Cycling Track', id: 'ct' },
    diving: { title: 'Diving', id: 'dv' },
    equestrian: { title: 'Equestrian', id: 'eq' },
    fencing: { title: 'Fencing', id: 'fe' },
    football: { title: 'Football', id: 'fb' },
    golf: { title: 'Golf', id: 'go' },
    handball: { title: 'Handball', id: 'hb' },
    hockey: { title: 'Hockey', id: 'ho' },
    jetski: { title: 'JetSki', id: 'js' },
    judo: { title: 'Judo', id: 'ju' },
    ju_jitsu: { title: 'Ju-Jitsu', id: 'jj' },
    kabaddi: { title: 'Kabaddi', id: 'kd' },
    karate: { title: 'Karate', id: 'ka' },
    kurash: { title: 'Kurash', id: 'ku' },
    modern_pentathlon: { title: 'Modern Pentathlon', id: 'mp' },
    paragliding: { title: 'Paragliding', id: 'pg' },
    pencak_silat: { title: 'Pencak Silat', id: 'ps' },
    rhythmic_gymnastics: { title: 'Rhythmic Gymnastics', id: 'gr' },
    roller_skate: { title: 'Roller Skate', id: 'rs' },
    rowing: { title: 'Rowing', id: 'ro' },
    rugby_sevens: { title: 'Rugby Sevens', id: 'ru' },
    sailing: { title: 'Sailing', id: 'sa' },
    sambo: { title: 'Sambo', id: 'sc' },
    sepaktakraw: { title: 'Sepaktakraw', id: 'se' },
    shooting: { title: 'Shooting', id: 'sh' },
    skateboard: { title: 'Skateboard', id: 'sk' },
    soft_tennis: { title: 'Soft Tennis', id: 'sf' },
    softball: { title: 'Softball', id: 'so' },
    sport_climbing: { title: 'Sport Climbing', id: 'cl' },
    squash: { title: 'Squash', id: 'sq' },
    swimming: { title: 'Swimming', id: 'sw' },
    table_tennis: { title: 'Table Tennis', id: 'tt' },
    taekwondo: { title: 'Taekwondo', id: 'tk' },
    tennis: { title: 'Tennis', id: 'te' },
    trampoline_gymnastics: { title: 'Trampoline Gymnastics', id: 'gt' },
    triathlon: { title: 'Triathlon', id: 'tr' },
    volleyball: { title: 'Volleyball', id: 'vo' },
    water_polo: { title: 'Water Polo', id: 'wp' },
    weightlifting: { title: 'Weightlifting', id: 'wl' },
    wrestling: { title: 'Wrestling', id: 'wr' },
    wushu: { title: 'Wushu', id: 'wu' }
};

module.exports = {
    getAllSchedule: async function (sport, lang) {
        try {
            if (!sports[sport] || language.indexOf(lang) === -1) {
                throw new Error();
            }
            const options = {
                method: "GET",
                uri: `https://${lang}.asiangames2018.id/api/mobileapp/device/smartphone/schedules/disc/${sports[sport].id.toUpperCase()}/current`,
                json: true
            };
            const result = await request(options);
            // Loop submenu
            const submenu = _.map(_.filter(result.Sections, function (e) {
                return e.Type === "submenu"
            })[0].Items, function (e) {
                return e.Url
            });
            // Get schedule
            const listSchedule = [];
            for (const url of submenu) {
                const opt = {
                    method: "GET",
                    uri: url,
                    json: true
                };
                const result = await request(opt);
                const schedules = _.filter(result.Sections, function (e) {
                    return e.Type === "content"
                })[0].Items;
                for (const schedule of schedules) {
                    listSchedule.push({
                        id: schedule.ID.split("_")[2],
                        title: schedule.Title,
                        description: schedule.Subtitle,
                        time: schedule.DateTime
                    });
                }
            }
            return listSchedule;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
}