<script id="ui.dashboard" type="text/x-handlebars-template">
	{{#if dashboard}}
		<div class="row {{row-class dashboard.layout "tall" 0}}">
			<div class="col-xs-12 chart-container">
				{{#each-if widgetInstances "display.row" 0}}
					<div class="chart chart-large" id="container-widget{{id}}">
						<div class="widget" id="widget{{id}}">
						</div>
					</div>
				{{else}}
					<div class="chart chart-large">
						<div class="loader">add widget</div>
					</div>
				{{/each-if}}
			</div>
		</div>
		<div class="row {{row-class dashboard.layout "short" 1}}">
			<div class="col-xs-4 chart-container">
				<div class="chart chart-small">
					<div class="loader">add widget</div>
				</div>
			</div>
			<div class="col-xs-4 chart-container">
				<div class="chart chart-small">
					<div class="loader">add widget</div>
				</div>
			</div>
			<div class="col-xs-4 chart-container last">
				<div class="chart chart-small">
					<div class="loader">add widget</div>
				</div>
			</div>
		</div>
		<div class="row {{row-class dashboard.layout "tall" 2}}">
			<div class="col-xs-12 chart-container last">
				{{#each-if widgetInstances "display.row" 2}}
					<div class="chart chart-large" id="container-widget{{id}}">
						<div class="widget" id="widget{{id}}">
						</div>
					</div>
				{{else}}
					<div class="chart chart-large">
						<div class="loader">add widget</div>
					</div>
				{{/each-if}}
			</div>
		</div>
	{{else}}
		Should create a new DS
	{{/if}}
</script>
<script id="ui.footer" type="text/x-handlebars-template">
<div class="container-fluid">
	<div class="row">
		<div class="col-xs-2">
			 <div class="footer-search">
				<input type="text" placeholder="search (Cmd + K)">
			</div>
		</div>
		<div class="col-xs-10">
			<span class="logo">larch.io</span>
		</div>
	</div>
</div>
</script>
<script id="ui.header" type="text/x-handlebars-template">
	<div class="navbar-header">
		<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		</button>
	</div>

	<div class="navbar-collapse collapse">
		<div class="col-xs-4">
			<ul class="nav navbar-nav">
				<li><a class="navbar-nav-link" href="" data-on-click="newDashboard()">new dashboard</a></li>
				<li><a class="navbar-nav-link" href="" data-on-click="authNewSource()">my accounts</a></li>
			</ul>
		</div>

		<div class="col-xs-4 navbar-centered">
			<ul class="nav navbar-nav">
				<li>{{#if hasDashboards}}<a class="navbar-nav-link" href="" data-on-click="removeDashboard()">remove</a>{{/if}}</li>
				<li>{{#if hasDashboards}}<a class="navbar-nav-link" href="" data-on-click="removeDashboard()">share</a>{{/if}}</li>
				<li>{{#if hasDashboards}}<a class="navbar-nav-link" href="" data-on-click="openEdit()">edit</a>{{/if}}</li>
				<li>{{#if hasDashboards}}<a class="navbar-nav-link" href="" data-on-click="likeDashboard()">
						{{#if hasLike}}hate{{else}}like{{/if}}</a>
					{{/if}}</li>
			</ul>
		</div>

		<div class="col-xs-4">
			<ul class="nav navbar-nav navbar-right">
				<li><a class="navbar-nav-link" href="" data-on-click="logout()">logout</a></li>
				<li><a class="navbar-nav-link" href="#">{{user.username}}</a></li>
			</ul>
		</div>
	</div>
</script>
<script id="ui.login" type="text/x-handlebars-template">
    <h2>Login</h2>
    <div class="alert alert-danger"></div>
    <form name="form" role="form">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" name="username" data-model="username" class="form-control" required value="test@test.com" />
            <span class="help-block">Username is required</span>
        </div>
        <div class="form-group" >
            <label for="password">Password</label>
            <input type="password" name="password" data-model="password" class="form-control" required value="test" />
            <span class="help-block">Password is required</span>
        </div>
        <div class="form-actions">
            <button class="btn btn-primary" data-on-click="login()">Login</button>
            {{> resultMsg result }}
            <!-- <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            <a href="#/register" class="btn btn-link">Register</a> -->
        </div>
    </form>
</script>
<script id="ui.modal.edit.dashboard" type="text/x-handlebars-template">
	<div class="col-md-10">
		<form class="form-horizontal" id="edit-dashboard-form">
			<div class="form-group">
				<label class="col-sm-2 control-label">name</label>
				<div class="col-sm-10">
					<input name="name" class="settings form-control" placeholder="put the name here" type="text" data-model="name" value="{{ds.name}}">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">description</label>
				<div class="col-sm-10">
					<textarea name="desc" class="settings form-control" placeholder="this is my fancy new dashboard" data-model="desc">{{ds.desc}}</textarea>
				</div>
			</div>
			<button type="button" class="btn btn-primary" data-on-click="updateDashboard()">Update</button>
			{{#if error}}
				{{error}}
			{{/if}}
			{{#if newlyCreatedId}}
				successfuly created new dashboard
			{{/if}}
		</form>
	</div>
</script>
<script id="ui.modal.edit" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-on-click="close()" aria-label="Close"><span aria-hidden="true">done</span></button>
					<ul class="nav nav-tabs">
						<li role="presentation"><a href="" data-on-click="toggleTab('tab-dashboard', true)">dashboard</a></li>
						<li role="presentation" class="active"><a href="" data-on-click="toggleTab('tab-widgets', true)">widget</a></li>
						<li role="presentation"><a href="" data-on-click="toggleTab('tab-addwidget', true)">add widget</a></li>
					</ul>
				</div>
				<div class="modal-body">
					<div class="tab-content">
						<div role="tabpanel" class="tab-pane row" id="tab-dashboard">
							{{!-- add dashboard panel --}}
						</div>
						<div role="tabpanel" class="tab-pane row" id="tab-addwidget">
							{{!-- add widget panel --}}
						</div>
						<div role="tabpanel" class="tab-pane row active" id="tab-widgets">
							{{!-- edit widget panel --}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</script>

<script id="ui.modal.edit.search" type="text/x-handlebars-template">
	<div class="awesomplete">
		<input id="search-box" autofocus="" class="awesomplete" autocomplete="false" aria-autocomplete="list" value="{{value}}" data-on-keypress="searchAutocomplete()">
	</div>
	<div class="results">
		{{#each results}}
			<div class="item">
				<span class="name">{{name}}</span>
				<span class="title">{{title}}</span>
				<div>{{versions.0.description}} | latest version: {{versions.0.version}}</div>
				<!-- Single button -->
				<div class="btn-group">
					<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-on-click="showDropdown()">add widget<span class="caret"></span></button>
					<ul class="dropdown-menu">
						{{#withHash @root.emptySlots name}}
							{{#each this}}
								<li><a href="" data-on-click="addWidget('{{../../id}}', {{this}})">{{get-position this}}</a></li>
							{{/each}}
						{{/withHash}}
					</ul>
				</div>
			</div>
		{{/each}}
	</div>
</script>
<script id="ui.modal.edit.widget.detail" type="text/x-handlebars-template">
	{{!-- edit widget panel --}}
	<div class="col-md-4">
		<h5>TOP WIDGET</h5>
		<ul id="drag-drop-top">
			{{#each-if widgetInstances "display.row" 0}}
				{{#withHash @root.widgets id}}
					<li class="widget-item"><a href="" class="{{toggle-class id @root.selectedWidgetId 'selected'}}"
						data-on-click="showSettings('{{id}}')">{{name}}</a></li>
				{{/withHash}}
			{{else}}
				<li>add new top widget</li>
			{{/each-if}}
		</ul>
		<h5>MIDDLE WIDGETS</h5>
		<ul id="drag-drop-middle">
			{{!-- for all widgets --}}
			{{#each-if widgetInstances "display.row" 1}}
				{{#withHash @root.widgets id}}
					<li class="widget-item"><a href="" class="{{toggle-class id @root.selectedWidgetId 'selected'}}"
						data-on-click="showSettings('{{id}}')">{{name}}</a></li>
				{{/withHash}}
			{{/each-if}}
			{{!-- display add links --}}
			{{#middle-widgets-add-links widgetInstances}}
				<li>add new middle widget {{index}}</li>
			{{/middle-widgets-add-links}}
		</ul>
		<h5>BOTTOM WIDGET</h5>
		<ul id="drag-drop-bottom">
			{{#each-if widgetInstances "display.row" 2}}			
				{{#withHash @root.widgets id}}
					<li class="widget-item"><a href="" class="{{toggle-class id @root.selectedWidgetId 'selected'}}"
						data-on-click="showSettings('{{id}}')">{{name}}</a></li>
				{{/withHash}}
			{{else}}
				<li>add new bottom widget</li>
			{{/each-if}}
		</ul>
	</div>

	{{!-- detail form --}}
	{{#each-if widgets "id" selectedWidgetId}}
		<div id="widget-detail-{{id}}" class="col-md-8">
			{{version.description}}
			<form class="form-horizontal" id="edit-widget-form">
				{{#each version.general.params as |type settingName|}}
					<div class="form-group">
						<label class="col-sm-2 control-label">{{settingName}}</label>
						<div class="col-sm-10">
							{{#with @root.selectedWidgetSettings}}
							<input name="{{settingName}}" class="settings form-control" placeholder="{{settingName}}" type="{{type}}"
								value="{{lookup-property this settingName}}">
							{{/with}}
						</div>
					</div>
				{{/each}}
				<button type="button" class="btn btn-primary"
					data-on-click="saveChanges()">Confirm changes</button>
			</form>
		</div>
	{{else}}
		hello, anything to setup?
	{{/each-if}}
</script>
<script id="ui.modal.new" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-on-click="close()" aria-label="Close"><span aria-hidden="true">done</span></button>
					Create a new dashboard
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="edit-dashboard-form">
						<div class="form-group">
							<label class="col-sm-2 control-label">name</label>
							<div class="col-sm-10">
								<input name="name" class="settings form-control" placeholder="put the name here" type="text" data-model="name" value="{{ds.name}}">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">description</label>
							<div class="col-sm-10">
								<textarea name="desc" class="settings form-control" placeholder="this is my fancy new dashboard" data-model="desc">{{ds.desc}}</textarea>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">layout</label>
							<div class="col-sm-10">
								<select data-model="layout" class="form-control">
									<option value="['tall', false, false]">one eye</option>
									<option value="['tall', false, 'tall']">two to manage</option>
									<option value="[false, 'short', 'tall']">smalls on top</option>
									<option value="['tall', 'short', false]">smalls on bottom</option>
									<option value="['tall', 'short', 'tall']">full page</option>
								</select>
							</div>
						</div>
						<button type="button" class="btn btn-primary" data-on-click="save()">Ready</button>
						{{#if error}}
							{{error}}
						{{/if}}
						{{#if newlyCreatedId}}
							successfuly created new dashboard
						{{/if}}
					</form>
				</div>
			</div>
		</div>
	</div>
</script>
<script id="ui.modal.remove" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-on-click="close()" aria-label="Close"><span aria-hidden="true">done</span></button>
					Remove a dashboard
				</div>
				<div class="modal-body">
					Are you really angry with this dashboard, so that you want to delete it?

					<button type="button" class="btn btn-danger" data-on-click="remove()">Delete {{dashboard.name}}</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</script>
<script id="ui.sidebar" type="text/x-handlebars-template">
	<h5>I LIKE</h5>
	<ul class="sidebar-list">
		{{#each-if dashboards "like" true}}
			<li><a href="" class="{{toggle-class id ../route 'selected'}}">{{name}}</a></li>
		{{else}}
			<li>any dashboard you like?</li>
		{{/each-if}}
	</ul>

	<h5>SHARED</h5>
	<ul class="sidebar-list">
		{{#each-if dashboards "shared" true}}
			<li><a href="" class="{{toggle-class id ../route 'selected'}}">{{name}}</a></li>
		{{else}}
			<li>any shared dashboard?</li>
		{{/each-if}}
	</ul>


	<h5>THE OTHERS</h5>
	<ul class="sidebar-list">
		{{#each-if dashboards "like" false}}
			{{#if this.shared}}
			{{else}}
				<li><a href="" data-on-click="navigate('/dashboard/{{this.id}}')" class="{{toggle-class this.id ../route 'selected'}}">{{this.name}}</a></li>
			{{/if}}
		{{else}}
			<li>loader</li>
		{{/each-if}}
	</ul>
</script>