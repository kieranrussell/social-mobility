/**
 * Created by Kieran on 18/06/2017.
 */
var State = {
    states: [],
    current: '',
    navigate: function (toState) {
        if (toState) {
            var state = this.states.filter(function (state) {
                return state.name === toState;
            })[0];
            renderState(toState).then(function(){
                state.callback();
            });
            this.current = toState;
        }
    },
    add: function (name, callback) {
        this.states.push(
            {
                name: name,
                callback: callback
            });
        return this;
    },
    getCurrent: function(){
        return this.current;
    },
    getStates: function(){
        return this.states;
    }
};

function renderState(stateToGoTo) {
    return new Promise(function(resolve, reject){
        var view = document.getElementsByTagName('state-render')[0];
        getViewHtml(stateToGoTo).then(function (res) {
            view.innerHTML = res;
            resolve();
        }).catch(function (err) {
            console.log('Error Catch');
            console.log(err);
            reject();
        });
    });
}

function getViewHtml(viewName) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'views/' + viewName + '.html');
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

