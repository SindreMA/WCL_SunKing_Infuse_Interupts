const axios = require('axios')
const _ = require('underscore')
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

const log = 'WdAMhmvHBqc9nYkz'
const smashesURL = `https://www.warcraftlogs.com:443/v1/report/events/casts/${log}?start=0&end=900000000&hostility=1&abilityid=325506&translate=true&api_key=97018d82f906e10d18756c20f9c9b688`
const mainDataURl = `https://www.warcraftlogs.com:443/v1/report/fights/${log}?api_key=97018d82f906e10d18756c20f9c9b688`

let hitLS = []

axios.get(mainDataURl).then(main => {
    if (main.data) {
        var data = main.data
        axios.get(smashesURL).then(sunkingRe => {
            if (sunkingRe.data) {
                if (sunkingRe.data.events) {
                    var events = sunkingRe.data.events.filter(x=> x.type === 'begincast')
                    //console.log(events);
                    const infuseURL = `https://www.warcraftlogs.com:443/v1/report/events/casts/${log}/?start=${0}&end=${900000000}&hostility=0&abilityid=339232&translate=true&api_key=97018d82f906e10d18756c20f9c9b688`

                    axios.get(infuseURL).then(interuptedInfusesRe => {
                        const infCast = interuptedInfusesRe.data.events;

                        //console.log(infCast.filter(x=> x.timestamp + 15000 > 10208430 10048738 && x.timestamp - 15000  < 10048738));
                        //return;

                        const smashes = events.map((x, smashindex) => {

  

                            return {
                                fight: x.fight,
                                when: moment.duration(x.timestamp, "milliseconds").format("hh:mm:ss"),

                                index: smashindex,
                                hitPlayers: infCast.filter(c => { 
                                    return c.timestamp < x.timestamp &&  (c.timestamp + 15000) > x.timestamp
                                }
                                    
                                ).map(x=> data.friendlies.find(c=>  x.sourceID === c.id).name || "test")
                            }
                        })
                        console.log((smashes.filter(x=> x.hitPlayers.length !== 0)));

                        
                        var lls = {}
                        for (const playerls of smashes) {
                            for (const player of playerls.hitPlayers) {
                                lls[player] ? lls[player] = lls[player] + 1 : lls[player] = 1 
                            }
                        }
                        console.log(lls);
                    })
                }
            }
        })
    }
})
