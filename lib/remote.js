'use strict';

var Git = require('nodegit');
var debug = require('debug')('kit:remote');


module.exports = function(repo, o){
    o = o || {};

    if (o.verbose){
        return Git.Remote.list(repo)
        .then(function(names){
            return Promise.all(names.map(function(name){
                return Git.Remote.lookup(repo, name);
            }))
            .then(function(remotes){
                return remotes.map(function(remote){
                    return {
                        name: remote.name(),
                        fetch: remote.url(),
                        push: remote.pushurl()
                    };
                });
            });
        });
    }

    return {

        add: function(name, url){
            return Git.Remote.create(repo, name, url);
        },

        remove: function(name){
            return Git.Remote.delete(repo, name);
        },

        list: function(){
            return Git.Remote.list(repo);
        },

        update: function(name, url){
            return Git.Remote.lookup(repo, name)
            .then(function(remote){
                remote.setUrl(url);
                remote.save();
            })
            .catch(function(error){
                return Git.Remote.create(name, url);
            })
            .then(function(){
                return repo;
            });
        }

    };

};
