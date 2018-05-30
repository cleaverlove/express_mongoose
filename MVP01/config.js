/*
    创建用户
    use MVP01
    db.createUser({
        user: 'MVP01',
        pwd: 'MVP01',
        role: [{role: 'readWrite', db: 'MVP01'}]
    })
*/
module.exports = {
    'database': 'mongodb://MVP01:MVP01@localhost:27017/MVP01'
}