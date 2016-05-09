var git = require('../');

var test = require('ava');
var files = require('fildes-extra');
var resolve = require('path').resolve;

var local1 = resolve(__dirname, './repos/local1');
var local2 = resolve(__dirname, './repos/local2');
var remote1 = resolve(__dirname, './repos/remote1');
var remote2 = resolve(__dirname, './repos/remote2');


test.serial('remote setup (local and dummy remote)', function(t){
    return Promise.all([
        files.rmdir(local1),
        files.rmdir(local2),
        files.rmdir(remote1),
        files.rmdir(remote2)
    ])
    .then(function(){
        return Promise.all([
            git.init(local1),
            git.init(local2),
            git.init(remote1, { bare: 1 }),
            git.init(remote2, { bare: 1 })
        ])
    })
    .catch(function(err){
        t.fail(err);
    });
});

test.serial('remote add', function(t){
    return git.open(local1)
    .then(function(repo){
        var remote = git.remote(repo);
        return remote.add('origin', remote1)
        .then(function(){
            return remote.add('remote2', remote2);
        })
        .then(function(){
            return git.remote(repo, {
                verbose: true
            })
            .then(function(remotes){
                t.is(remotes.length, 2, 'has 2 remotes');
            })
        })
    })
    .catch(function(err){
        t.fail(err);
    });
});

test.serial('remote remove', function(t){
    return git.open(local2)
    .then(function(repo){
        var remote = git.remote(repo);
        return remote.add('upstream', remote1)
        .then(function(){
            return remote.add('remote2', remote2);
        })
        .then(function(){
            return remote.remove('remote2');
        })
        .then(function(){
            return git.remote(repo, {
                verbose: true
            })
            .then(function(remotes){
                t.is(remotes.length, 1, 'has 1 remote');
            })
        })
    })
    .catch(function(err){
        t.fail(err);
    });
});


test.serial('push', function(t){
    var filepath = resolve(local1, 'new-file.txt');

    return git.open(local1)
    .then(function(repo){
        return files.writeFile(filepath, 'a new file!\n')
        .then(function(){
            return git.commit(repo, {
                'message': 'added a new file'
            });
        })
        .then(function(oid){
            return git.push(repo);
        })
    })
    .catch(function(err){
        t.fail(err);
    });
});


test.serial('pull', function(t){
    return git.open(local2)
    .then(function(repo){
        return git.pull(repo, {
            remote: 'upstream'
        });
    })
    .catch(function(err){
        t.fail(err);
    });
});
