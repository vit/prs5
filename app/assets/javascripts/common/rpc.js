window.addEvent('domready',function() {

	var JsonRequest = function() {
		return {
			send: function(url, data, callback) {
			//	var vvv = JSON.encode(data);
			//	alert( vvv );
				(new Request({
					url: url,
					method: 'post',
					urlEncoded: false,
					headers: {'Content-Type': 'application/json'},
					onComplete: function(answer){
					//	if(callback) callback( JSON.decode(answer) );
						data = JSON && JSON.parse(answer) || JSON.decode(answer);
						if(callback) callback( data );
					}
				})).send( {data: JSON.encode(data)} );
			//	})).send( {data: vvv} );
			}
		}
	};
	var req = JsonRequest();
	RPC = function(){
		return {
			send: function(method, params, callback) {
			      var url = "/rpc/";
			      var body = {method: method, params: params};
			      req.send(url, body, function(res) {
			//	      alert(JSON.encode(res));
				      if(callback && res) callback(res.result, res.error);
			      });
			}
		}
	}();
	ConfRPC = function(cont_id){
		return {
			conf: {
				send: function(method, params, callback) {
					params.unshift(cont_id);
					RPC.send(method, params, callback);
				}
			}
		}
	};

});

