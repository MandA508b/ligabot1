const db = require('mongoose')

db.set('strictQuery', true);
main().catch(err => console.log(err))

async function main(){
    await db.connect(`${process.env.DB_URL}`)
}

main();

module.exports = db;
