
window.addEvent('domready',function() {

	const conf = self.conf;
	const user = self.user;

    const dict = Dict( $('manager-dict') );
    console.log(dict);
    console.log(dict('lang_ru'));

    function createFullMyReviewData(r) {
        const stub = {
            score: null,
            decision: null,
            section: null,
            ipccomments: conf.lang_list().reduce(function(acc, l) {
                acc[l] = "";
                return acc;
            }, {}),
            authcomments: conf.lang_list().reduce(function(acc, l) {
                acc[l] = "";
                return acc;
            }, {}),
        };
        return deepmerge(stub, r || {});
    }

    Vue.component('my-menu-item', {
        template: "#my-menu-item-comp",
        props: ['content', 'cnt', 'active', 'color'],
        data: function () {
            return {
            }
        }
    })

    const comp = new Vue({
        el: '#components-demo',
        data: function() {
            return {
                //clicked: false,
                lst: [
                ],
                conf: {},
                dict: function(s) { return s+s; },
                loadInProgress: false,
                /*
                reviewer_decisions: [
                    'uncertain',
                    'reject',
                    'accept',
                    'accept_poster',
                    'accept_plenary'
                ],
                */
                //filter_my_score: 'all',
                //filter_my_decision: 'all',
                //filter_my_section: 'all',
                filter_my_full: {type: "common", value: "all"}
            }
        },
        computed: {
            /*
            counters_my_decision: function() {
                const rez = {};
                this.reviewer_decisions.each(function(d) { rez[d] = 0; });
                rez.all = this.lst.length;
    			this.lst.each(function(p) {
    			    if(p.my_review && p.my_review.decision)
    			        rez[p.my_review.decision]++;
    			    else
    			        rez['uncertain']++;
    			});
                return rez;
            },
            */
            counters_my: function() {
                const rez = {
                    common: {},
                    decision: {uncertain: 0},
                    score: {},
                    section: {}
                };
                rez.common.all = this.lst.length;
                ['absent', 'complete', 'incomplete'].each(function(d) { rez.common[d] = 0; });
//                this.reviewer_decisions.each(function(d) { rez.decision[d] = 0; });
                if(this.conf.reviewer_decisions)
                    this.conf.reviewer_decisions.each(function(d) { rez.decision[d] = 0; });
                if(this.conf.reviewer_scores)
                    this.conf.reviewer_scores.each(function(d) { rez.score[d] = 0; });
                if(this.conf.sections)
                    this.conf.sections.each(function(d) { rez.section[d.id] = 0; });
    			this.lst.each(function(p) {
    			    if(p.my_review && p.my_review.score)
    			        rez.score[p.my_review.score]++;
    			    if(!p.my_review || !p.my_review.decision)
    			        rez.decision['uncertain']++;
    			    if(p.my_review && p.my_review.decision)
    			        rez.decision[p.my_review.decision]++;
    			    if(p.my_review && p.my_review.section)
    			        rez.section[p.my_review.section]++;
    			    if(!p.my_review)
    			        rez.common['absent']++;
    			    if(p.my_review && (p.my_review.score && p.my_review.decision && p.my_review.section) )
    			        rez.common['complete']++;
    			    if(p.my_review && (!p.my_review.score || !p.my_review.decision || !p.my_review.section) )
    			        rez.common['incomplete']++;
    			});
                return rez;
            }
        },
        created: function() {
            //console.log("created()");
            const that = this;
            that.dict = dict;

        	conf.addEvent('init_ok', function(result, error) {
        	    conf.reviewer_scores = [];
        	    conf.reviewer_decisions = [];
        	    conf.sections = [];
        	    //console.log(conf);
        	    that.conf = conf;

        	    that.reload();
///*
					RPC.send('conf.review.get_reviewer_scores', [conf.id], function(result, error) {
						if (result)
						    that.conf.reviewer_scores = result;
						RPC.send('conf.get_reviewer_decisions', [conf.id], function(result, error) {
							if (result)
    						    that.conf.reviewer_decisions = result;
							RPC.send('conf.get_conf_sections', [conf.id], function(result, error) {
								if (result) {
        						    that.conf.sections = result;
        						    that.conf.sections_by_id = result.map(function(v, i) {
        						        v.index = i+1;
        						        return v;
        						    }).reduce(function(acc, val) {
        						        if(val && val.id)
        						            acc[val.id] = val;
        						        return acc;
        						    }, {});
        						    //console.log(that.conf.sections)
        						    //console.log(that.conf.sections_by_id)
								}
							});
						});
					});
//*/

        	});
        },
        methods: {
            clickItem: function(p) {
                p.show_details = ! p.show_details;
            },
            saveMyReview: function(p) {
//                console.log("saveMyReview():", user.id, conf.id, p._id, p.my_review_data);
				RPC.send('conf.review.save_my_review_data', [user.id, conf.id, p._id, p.my_review_data], function(result, error) {
				    if(result) {
				        p.my_review = result;
				        p.my_review_data = createFullMyReviewData(p.my_review);
                        comp.$toast.open({
                            message: dict('review_saved'), // 'Your review was saved successfully',
                            type: 'is-success'
                        });
				    }
//					alert( dict('review_saved') );
                    //console.log("saveMyReview():", result, error);
				});

//            	RPC.send('conf.review.get_my_review_data', [user.id, conf.id, paper_id], function(result, error) {
//					di.set(result);
//				});
            },
            listItemVisible: function(p) {
                const f = comp.filter_my_full;
                return (
                    f.type=='common' && f.value=='all' ||
                    f.type=='common' && f.value=='complete' && p.my_review &&
                        (p.my_review.score && p.my_review.decision && p.my_review.section ) ||
                    f.type=='common' && f.value=='incomplete' && p.my_review &&
                        (!p.my_review.score || !p.my_review.decision || !p.my_review.section ) ||
                    f.type=='common' && f.value=='absent' && !p.my_review ||
                    f.type=='score' && p.my_review && p.my_review.score==f.value ||
                    f.type=='decision' && (
                        p.my_review && p.my_review.decision==f.value ||
                        f.value == 'uncertain' && (!p.my_review || !p.my_review.decision)
                    ) ||
//                    f.type=='section' && p.my_review && p.my_review.section && p.my_review.section.id==f.value ||
                    f.type=='section' && p.my_review && p.my_review.section==f.value ||
                    false
                    /*
                    (
                        comp.filter_my_score=="all"
                    ) &&
                    (
                        comp.filter_my_decision=="all" ||
                        p.my_review && comp.filter_my_decision==p.my_review.decision ||
                        comp.filter_my_decision=="uncertain" && (!p.my_review || !p.my_review.decision)
                    ) &&
                    (
                        comp.filter_my_section=="all"
                    )
                    */
                );
            },
            decisionIcon: function(v) {
                const rez = ({
//                    uncertain: {icon: 'far fa-circle', color: 'black'},
//                    reject: {icon: 'circle', color: 'red'},
                    reject: {icon: 'fas fa-circle', color: 'crimson'},
                    accept: {icon: 'fas fa-circle', color: 'darkgreen'},
                    accept_poster: {icon: 'fas fa-circle', color: 'seagreen'},
                    accept_plenary: {icon: 'fas fa-circle', color: 'darkolivegreen'},
                })[v] || {icon: 'far fa-circle', color: 'black'};
                return rez;
            },
            scoreShortText: function(v) {
                const rez = ({
                    a: "A/5.0",
                    b: "B/4.0",
                    c: "C/3.0",
                    d: "D/2.0",
                })[v] || "?/?.?";
                return rez;
            },
            sectionText: function(v) {
                return conf.sections_by_id[v.id].index +": "+ comp.conf.lang_list().map(function(l) {
                    return v.name[l];
                }).join(" | ");
            },
    		reload: function (){
//        	    console.log("reload()");

        	    comp.loadInProgress = true;
    			if(conf.my_rights['appoint_reviewers'] || conf.my_rights['review_everything'] || conf.my_rights['set_final_decision']){
    				comp.lst = [];
            	    comp.loadOneChunk();
/*
    				RPC.send('conf.paper.get_all_papers_list_2', [user.id, , conf.id], function(result, error) {
    					if(!result) result = [];
    					comp.loadInProgress = false;
    					result.each(function(p) {
    					    p.show_details = false;
    					    p.my_review_data = createFullMyReviewData(p.my_review);
    					});
    					comp.lst = result;
    				});
*/
    			} else {
//            	    console.log("reload() 003");
/*
    				RPC.send('conf.paper.get_papers_for_reviewing_list', [user.id, conf.id], function(result, error) {
                	    //console.log("reload() 004");
    					//alert( JSON.encode(result) );
    					if(!result) result = [];
    					//renderList(result);
    					//this.lst = result;
    					comp.loadInProgress = false;
    					result.each(function(p) {p.show_details = false;});
    					comp.lst = result;
    				});
*/
    			}
    		},
    		loadOneChunk: function(offset=0, limit=20) {
    				RPC.send('conf.paper.get_all_papers_list_2', [user.id, , conf.id, offset, limit], function(result, error) {
    					if(!result) result = [];
    					if(result.length > 0) {
        					result.each(function(p) {
        					    p.show_details = false;
        					    p.my_review_data = createFullMyReviewData(p.my_review);
        					});
        					//console.log(result);
        					comp.lst = comp.lst.concat(result);
        					comp.loadOneChunk(offset+limit, limit);
        					//comp.loadInProgress = false;
        					//console.log(comp.lst);
    					} else {
        					comp.loadInProgress = false;
    					}
    				});
    		},
    		myReviewSelects: function() {
    		    const rez = [
//    		        {id: 'score', label: "Score", placeholder: "Select score", items: comp.conf.reviewer_scores.map(function(s) { return {id: s, name: 'score_'+s}; }) },
    		        {id: 'score', label: "Score", placeholder: dict('select_score'), items: comp.conf.reviewer_scores.map(function(s) { return {id: s, name: dict('score_'+s)}; }) },
//    		        {id: 'decision', label: "Recommended decision", placeholder: "Select decision", items: comp.conf.reviewer_decisions.map(function(s) { return {id: s, name: s}; }) },
    		        {id: 'decision', label: "Recommended decision", placeholder: dict('select_decision'), items: comp.conf.reviewer_decisions.map(function(s) { return {id: s, name: dict('decision_'+s)}; }) },
//    		        {id: 'section', label: "Recommended section", placeholder: "Select section", items: comp.conf.sections.map(function(s) { return {id: s.id, name: s.name}; }) },
    		        {id: 'section', label: "Recommended section", placeholder: dict('select_section'), items: comp.conf.sections.map(function(s) {
    		            return {id: s.id, name: comp.conf.lang_list().map(function(l) {
                            return s.name[l];
                        }).join(" | ")};
    		        }) },
                ];
    		    return rez;
    		},
    		myReviewTextAreas: function() {
    		    const rez = [
    		        {id: 'ipccomments', label: "Comments for IPC"},
    		        {id: 'authcomments', label: "Comments for Authors"},
                ];
    		    return rez;
    		},
    		//radioScoreSelected: function(v) {
    		//    //console.log(v);
    		//    comp.filter_my_full = {type: "score", value: v}
    		//},
    		//radioDecisionSelected: function(v) {
    		//    //console.log(v);
    		//    comp.filter_my_full = {type: "decision", value: v}
    		//}
        }
    })

});

