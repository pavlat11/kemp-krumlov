/* Vygeneruje api/cenik-vychozi.json (výchozí ceník pro výpočet ceny na serveru) z js/cenik.js.
   Spustit po změně výchozího ceníku v js/cenik.js:  node nastroje/cenik-vychozi.js js/cenik.js api/cenik-vychozi.json */
const fs=require('fs');const s=fs.readFileSync(process.argv[2],'utf8');
const i=s.indexOf('var VYCHOZI=');let d=0,j=s.indexOf('{',i);for(let k=j;k<s.length;k++){if(s[k]==='{')d++;else if(s[k]==='}'){d--;if(!d){j=k;break}}}
const V=eval('('+s.slice(s.indexOf('{',i),j+1)+')');fs.writeFileSync(process.argv[3],JSON.stringify(V));
console.log(Object.keys(V), V.polozky.length, JSON.stringify(V.sezona), V.polozky.filter(p=>['ubytovani','osoby','doplnky'].includes(p.kat)).map(p=>p.k+':'+p.a+'/'+p.b+(p.pro?' pro='+p.pro:'')).join(' '));
