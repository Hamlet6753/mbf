import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {parseEnv} from 'node:util';
const prod=JSON.parse(readFileSync('supabase/baseline/production-schema.json','utf8'));
const r=spawnSync(process.execPath,['node_modules/supabase/dist/supabase.js','db','query','--remote=gawblqkuodzuerzirsyr','--read-only','--file','supabase/baseline/inspect-schema.sql','--output-format','json'],{encoding:'utf8',env:{...process.env,NODE_USE_SYSTEM_CA:'1'}});
if(r.status!==0) throw new Error(r.stderr);
const dev=JSON.parse(r.stdout).rows[0].schema_snapshot;
writeFileSync('supabase/baseline/development-schema.json',JSON.stringify(dev,null,2)+'\n');
function normalize(v) { if(Array.isArray(v))return v.map(normalize).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])]));return v; }
for(const key of Object.keys(prod)) {
 if(JSON.stringify(normalize(prod[key]))!==JSON.stringify(normalize(dev[key]))) throw new Error(`Schema difference: ${key}`);
 console.log(`MATCH ${key}`);
}
const env=parseEnv(readFileSync('.env.dev.local','utf8'));
const headers={apikey:env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY};
for(const [path,count] of [['/rest/v1/genres?select=id',37],['/rest/v1/public_musicians?select=id',0],['/rest/v1/musicians?select=id',0]]) {
 const response=await fetch(env.NEXT_PUBLIC_SUPABASE_URL+path,{headers}); if(!response.ok)throw new Error(`REST ${response.status}: ${path}`);
 const rows=await response.json(); if(rows.length!==count)throw new Error(`Unexpected row count: ${path}`); console.log(`REST PASS ${path} (${count})`);
}
const response=await fetch(env.NEXT_PUBLIC_SUPABASE_URL+'/rest/v1/rpc/search_musicians',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:'{}'});
if(!response.ok || (await response.json()).length!==0)throw new Error('RPC guest smoke test failed');
console.log('REST RPC search_musicians PASS');
