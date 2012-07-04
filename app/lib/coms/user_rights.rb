# coding: UTF-8

module Coms
	#class OP_Rights
	class UserRights
		SUPERUSER = -> user_id, attr {
			attr[:appl].user.is_admin user_id
		}
		SUPERUSER_OR_CONF_OWNER = -> user_id, attr {
			SUPERUSER[user_id, attr] or attr[:appl].conf.user_is_conf_owner(user_id, attr[:rpc_params].first)
		}
		ANY_USER = -> user_id, attr {
			user_id
		}
		ITS_ME = -> user_id, attr {
			user_id && user_id.to_s == attr[:rpc_params].first.to_s
		}
		RIGHTS = {

		#USER
			'user.ping' => ANY_USER,
			'user.new_user' => (-> user_id, attr {
				appl = attr[:appl]
				true
			}),
			'user.restore_password' => (-> user_id, attr {
				appl = attr[:appl]
				true
			}),
			'user.get_user_email' => ITS_ME,
			'user.get_user_info' => ITS_ME,
			'user.set_user_email' => ITS_ME,
			'user.set_user_password' => ITS_ME,
			'user.set_user_info' => ITS_ME,
			'user.auth.userEnter' => (-> user_id, attr {
				appl = attr[:appl]
				true
			}),
			'user.add_to_admins_list' => SUPERUSER,
			'user.remove_from_admins_list' => (-> user_id, attr {
				SUPERUSER[user_id, attr] and user_id.to_s != attr[:rpc_params].first.to_s
			}),
			'user.get_admins_list' => SUPERUSER,
			'user.find_users' => SUPERUSER,

		#CONF
			'conf.new' => SUPERUSER,
			'conf.save_conf_info' => SUPERUSER_OR_CONF_OWNER,
			'conf.save_conf_keywords' => SUPERUSER_OR_CONF_OWNER,
			'conf.new_conf_role' => SUPERUSER_OR_CONF_OWNER,
			'conf.set_conf_role_rights' => SUPERUSER_OR_CONF_OWNER,
			'conf.add_conf_role_member' => SUPERUSER_OR_CONF_OWNER,
			'conf.remove_conf_role_member' => SUPERUSER_OR_CONF_OWNER,
			'conf.delete_conf_role' => SUPERUSER_OR_CONF_OWNER,

			'conf.new_conf_section' => SUPERUSER_OR_CONF_OWNER,
			'conf.set_conf_section_name' => SUPERUSER_OR_CONF_OWNER,
			'conf.add_conf_section_manager' => SUPERUSER_OR_CONF_OWNER,
			'conf.remove_conf_section_manager' => SUPERUSER_OR_CONF_OWNER,
			'conf.get_conf_section_managers' => SUPERUSER_OR_CONF_OWNER,
			'conf.delete_conf_section' => SUPERUSER_OR_CONF_OWNER,
		#	'conf.get_conf_sections' => SUPERUSER_OR_CONF_OWNER,
			'conf.get_conf_sections' => ANY_USER,

			'conf.set_conf_permissions' => SUPERUSER_OR_CONF_OWNER,

			'conf.get_conf_data' => SUPERUSER_OR_CONF_OWNER,
			'conf.get_conf_info' => (-> user_id, attr {
				appl = attr[:appl]
				user_id
			}),
			'conf.get_conf_keywords' => (-> user_id, attr {
				appl = attr[:appl]
				user_id
			}),
			'conf.get_confs_list' => (-> user_id, attr {
				appl = attr[:appl]
				user_id
			}),
			'conf.get_conf_role_rights' => (-> user_id, attr {
				appl = attr[:appl]
				user_id
			}),
			'conf.get_conf_permissions' => (-> user_id, attr {
				appl = attr[:appl]
				user_id
			}),
			'conf.get_conf_role_members' => (-> user_id, attr {
				appl = attr[:appl]
				user_id
			}),
			'conf.get_conf_roles' => (-> user_id, attr {
				appl = attr[:appl]
				user_id
			}),
			'conf.get_my_rights' => ITS_ME,

		#CONF.PAPER
			'conf.paper.save_my_paper_data' => (-> user_id, attr {
			#	p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][1] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][1] || {}
				(
			#		p['USER_REGISTER_NEW_PAPER'] && !attr[:rpc_params][2] || p['PAPREG_PAPER_EDIT'] && attr[:rpc_params][2] ||
					r['USER_REGISTER_NEW_PAPER'] && !attr[:rpc_params][2] || r['PAPREG_PAPER_EDIT'] && attr[:rpc_params][2]
				) &&
					user_id && user_id.to_s == attr[:rpc_params].first.to_s
			}),
		#	'get_my_paper_abstract_files_list' => ITS_ME,
			'conf.paper.get_my_paper_data' => (-> user_id, attr {
				user_id && user_id.to_s == attr[:rpc_params].first.to_s
			}),
			'conf.paper.delete_my_paper' => (-> user_id, attr {
			#	p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][1] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][1] || {}
				(
			#		p['PAPREG_PAPER_DELETE'] ||
					r['PAPREG_PAPER_DELETE']
				) &&
					user_id && user_id.to_s == attr[:rpc_params].first.to_s
			}),
			'conf.paper.get_my_papers_list' => (-> user_id, attr {
				user_id && user_id.to_s == attr[:rpc_params].first.to_s
			}),

			'conf.paper.get_papers_for_reviewing_list' => ITS_ME,
			'conf.paper.get_papers_managed_list' => ITS_ME,

			'conf.paper.get_all_papers_list' => (-> user_id, attr {
			#	user_id && user_id.to_s == attr[:rpc_params].first.to_s
			#!!!!!!
				#p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][1] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				(r['review_everything'] || r['appoint_reviewers'] || r['set_final_decision']) && user_id
				#user_id
			}),
			'conf.paper.get_paper_info' => (-> user_id, attr {
			#	user_id && user_id.to_s == attr[:rpc_params].first.to_s
			#!!!!!!
				#p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][1] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				(r['review_everything'] || r['appoint_reviewers'] || attr[:appl].conf.paper.is_paper_reviewer(user_id, attr[:rpc_params][0], attr[:rpc_params][1])) && user_id
				#user_id
			}),

			'conf.paper.add_to_paper_reviewers' => (-> user_id, attr {
				#p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][1] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				(r['appoint_reviewers']) && user_id
			}),
			'conf.paper.remove_from_paper_reviewers' => (-> user_id, attr {
				#p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][1] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				(r['appoint_reviewers']) && user_id
			}),
			'conf.paper.get_paper_reviewers' => (-> user_id, attr {
				#p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][1] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				(r['appoint_reviewers']) && user_id
			}),

			'conf.paper.set_paper_decision' => (-> user_id, attr {
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				(r['set_final_decision']) && user_id
			}),
			'conf.paper.get_paper_decision' => (-> user_id, attr {
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				(r['set_final_decision']) && user_id
			}),

		#CONF.REVIEW
			'conf.review.get_reviewer_scores' => (-> user_id, attr {true}),
			#'conf.review.get_reviewer_decisions' => (-> user_id, attr {true}),
			'conf.get_reviewer_decisions' => (-> user_id, attr {true}),
			'conf.set_reviewer_decisions' => SUPERUSER_OR_CONF_OWNER,
			#'conf.review.set_reviewer_decisions' => (-> user_id, attr {true}),
			#'conf.review.get_all_decisions' => (-> user_id, attr {true}),
			'conf.get_all_decisions' => (-> user_id, attr {true}),
			#'conf.review.get_reviewer_sections' => (-> user_id, attr {true}),

			# !!!!!
			'conf.review.save_my_review_data' => ITS_ME,
			'conf.review.get_my_review_data' => ITS_ME,
			'conf.review.save_my_review2_data' => ITS_ME,
			'conf.review.get_my_review2_data' => ITS_ME,

			'conf.review.get_my_paper_reviews' => ITS_ME,
			'conf.review.get_my_paper_reviews2' => ITS_ME,

			'conf.paper.get_my_paper_decision' => ITS_ME,

			'conf.review.get_paper_reviews_ext' => (-> user_id, attr {
			#	p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][0] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				r['delete_reviews'] && user_id
			}),
			'conf.review.delete_review' => (-> user_id, attr {
			#	p = attr[:appl].conf.get_conf_permissions attr[:rpc_params][0] || {}
				r = attr[:appl].conf.get_my_rights user_id, attr[:rpc_params][0] || {}
				r['delete_reviews'] && user_id
			}),

=begin
			'conf.review.get_full_data_by_id' => (-> user_id, attr {
				appl = attr[:appl]
				cont_id, lang_code, review_id = attr[:rpc_params]
				user_id and appl.conf.review.user_is_review_reviewer user_id, review_id
			}),
			'conf.review.save_reviewer_data_by_id' => (-> user_id, attr {
				appl = attr[:appl]
				cont_id, review_id, data = attr[:rpc_params]
				user_id and appl.conf.review.user_is_review_reviewer user_id, review_id
			})
=end

			'msg.get_my_threads_on_paper' => ITS_ME,

		}
		def self.check user_id, name, attr={} 
			RIGHTS[name] ? RIGHTS[name][user_id, attr] : false
		end
	end
end

