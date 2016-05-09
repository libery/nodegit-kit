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
        // if no refspec option
        // no all, mirror or tags?
        // use remote.*.push config
        // else push.default config
        // else push current branch to corresponding upstream branch

        // remote.getRefspec does not work yet :(
        // var refspec = remote.getRefspec(0);
        // var refspec = '+refs/heads/*:refs/remotes/origin/*';
        var refspec = 'refs/heads/master:refs/heads/master';
        return remote.push(refspec, {
            callbacks: {
                credentials: sshKeyFromAgent
            }
        });
    });

};
