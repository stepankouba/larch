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
		select notes from journals
		where
			journalized_id = ?
		    and notes <> ''
		order by created_on desc
		limit 1
	`,
	issuesForUser: `
		select i.*, cv.value as owner
			from issues as i
		    inner join custom_values as cv on cv.customized_id = i.id
		    inner join versions as v on i.fixed_version_id = v.id
		    where
		        cv.value = ?
		        and i.fixed_version_id in (
		        	select id from versions where month(effective_date) in (?)
		    	)
		        and cv.custom_field_id = 8
			;
	`,
	allSpent: `
		select round(sum(t.hours) / 8, 2) as value 
			from time_entries t 
			where 
				project_id in (1,2,3);
	`,
	lastWeekSpent: `
		select round(SUM(t.hours) / 8,2) as value 
			from time_entries as t 
			where t.project_id in (1,2,3) 
				and t.tweek = weekofyear(curdate()) - 1;
	`,
	monthVersion: `
		select (
		select round(IFNULL(sum(te.hours) / 8, 0), 2) as spent
			from
				time_entries as te
		    where
				te.issue_id in (
					select i.id
						from issues as i
		                where
							i.project_id in (?)
		        )
		        and month(te.spent_on) = ?
		) as spent, (
			select round(sum(i.estimated_hours) / 8, 2)
		    from issues as i
		    where i.id in (
					select i.id
						from issues as i
		                where
							i.project_id in (?)
		                    and i.fixed_version_id in (
								select v.id
									from versions as v
		                            where 
										month(v.effective_date) = ?
		                    )
		                    and i.tracker_id <> 3 -- not a support task 
		    )
		) as estimated
		;
	`
};