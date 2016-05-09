'use strict';

var Git = require('nodegit');

function sshKeyFromAgent(url, username){
    return Git.Cred.sshKeyFromAgent(username);
}

module.exports = function(repo, o){
    o = o || {};

    if (!o.remote){
        o.remote = 'origin';
    }

    return repo.getRemote(o.remote)
    .then(function(remote){
        return repo.fetch(remote, {
            callbacks: {
                credentials: sshKeyFromAgent,
                certificateCheck: function() {
                    return 1;
                }
            }
        });
    })
    .then(function(){
        return repo.getCurrentBranch();
    })
    .then(function(current){
        var from = o.remote + '/' + current.shorthand();
        return repo.mergeBranches(current, from);
    });

};
