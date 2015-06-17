'use strict';

module.exports = {
	issueDetail: `
		select i.estimated_hours, CURDATE() as date, i.subject, i.id, i.done_ratio, i.status_id, u.login
		from
			issues as i
			inner join users as u on i.assigned_to_id = u.id
		where
			i.id = ?; 
		`,
	tsAllDetailed: `
		SELECT spent_on, SUM(hours) as sum_hours
		FROM time_entries
		where issue_id = ?
		group by spent_on
		order by 1 desc
	`,
	users: `
		select
			id, login
		from
			users
		order by id asc
	`,
	journal: `
		select
			jd.*, j.notes, date(j.created_on) as 'created_on'
		from
		    journals as j 
		    inner join journal_details as jd on jd.journal_id = j.id
		where
			j.journalized_id = ?
		    and (
				(jd.property = 'attr' and jd.prop_key in ('status_id', 'estimated_hours', 'assigned_to_id', 'done_ratio'))
		        or (jd.property = 'cf')
				)
		order by
			j.created_on desc
	`,
	customFields: `
		select
			cf.id, cf.name, cv.value
		from
			custom_values as cv
		    inner join custom_fields as cf on cf.id = cv.custom_field_id
		where
			cv.customized_id = ?
	`,
	lastNote: `
		SELECT notes FROM journals
		where
			journalized_id = ?
		    and notes <> ''
		order by created_on desc
		limit 1
	`
};