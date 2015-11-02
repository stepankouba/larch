<script id="ui.dashboard" type="text/x-handlebars-template">
	{{#if dashboard}}
		<div class="row {{row-class dashboard.layout "tall" 0}}">
			<div class="col-xs-12 chart-container">
				{{#each-if dashboard.widgets "display.row" 0}}
					<div class="chart chart-large" id="container-widget{{id}}">
						<div class="loader"><i class="fa fa-spinner fa-spin fa-2x"></i></div>
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
				{{#each-if dashboard.widgets "display.row" 1}}
					<div class="chart chart-small" id="container-widget{{id}}">
						<div class="loader"><i class="fa fa-spinner fa-spin fa-2x"></i></div>
						<div class="widget" id="widget{{id}}">
						</div>
					</div>
				{{else}}
					<div class="chart chart-small">
						<div class="loader">add widget</div>
					</div>
				{{/each-if}}
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
				{{#each-if dashboard.widgets "display.row" 2}}
					<div class="chart chart-large" id="container-widget{{id}}">
						<div class="loader"><i class="fa fa-spinner fa-spin fa-2x"></i></div>
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
		
			<div class="jumbotron row-100 centered">
				<p>What about creating a new view?<p>
			<div>
	{{/if}}
</script>
<script id="ui.footer" type="text/x-handlebars-template">
<div class="container-fluid">
	<div class="row">
		<div class="col-xs-2">
			 <div class="footer-search">
				<input type="text" placeholder="search views (...well not now)" disabled>
			</div>
		</div>
		<div class="col-xs-10">
			<span class="logo">anylarch.com (beta)</span>
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
				<li><a class="navbar-nav-link" href="" data-on-click="newDashboard()">new view</a></li>
				<li>
					{{#if hasDashboards}}
						{{#unless isFromShared}}
							<a class="navbar-nav-link" href="" data-on-click="settings()">settings</a>
						{{/unless}}
					{{/if}}
				</li>
			</ul>
		</div>

		<div class="col-xs-4 navbar-centered">
			<ul class="nav navbar-nav">
				<li>
					{{#if hasDashboards}}
						{{#unless isFromShared}}
							<a class="navbar-nav-link" href="" data-on-click="shareDashboard()">share</a>
						{{/unless}}
					{{/if}}
				</li>
				<li>
					{{#if hasDashboards}}
						{{#unless isFromShared}}
							<a class="navbar-nav-link" href="" data-on-click="openEdit()">widgets</a>
						{{/unless}}
					{{/if}}
				</li>
				<li>
					{{#if hasDashboards}}
						{{#unless isFromShared}}
							<a class="navbar-nav-link" href="" data-on-click="likeDashboard()">
								{{#if hasLike}}hate{{else}} like{{/if}}
							</a>
						{{/unless}}
					{{/if}}
				</li>
				<li>
					{{#if hasDashboards}}
						<a class="navbar-nav-link" href="" data-on-click="removeDashboard()">remove</a>
					{{/if}}
				</li>
			</ul>
		</div>

		<div class="col-xs-4">
			<ul class="nav navbar-nav navbar-right">
				<li><a class="navbar-nav-link" href="" data-on-click="logout()">logout</a></li>
				<li><a class="navbar-nav-link" href="#" data-on-click="userProfile()">{{max-char user.username 30 '...'}}</a></li>
			</ul>
		</div>
	</div>
</script>
<script id="ui.login" type="text/x-handlebars-template">
    <h2>login</h2>
    {{#if error}}
        <div class="alert alert-danger">{{error}}</div>
    {{/if}}
    <form name="form" role="form" id="login-form">
        <div class="form-group">
            <input type="text" name="username" data-model="username" class="form-control" required value="test@test.com" />
        </div>
        <div class="form-group" >
            <input type="password" name="password" data-model="password" class="form-control" required value="test" />
        </div>
        <div class="form-actions">
            <button class="btn btn-primary" data-on-click="login()">log in</button>
        </div>
    </form>
</script>
<script id="ui.modal.edit" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="fullscreen-modal">
			<div class="modal-close-button">
				<a href="" class="close" data-on-click="close()"></a>
			</div>
			<div class="row">
				<h3><i class="fa fa-pencil-square-o"></i> edit widgets</h3>
				<div class="row modal-options">
					<div class="col-xs-8 col-xs-offset-2">
						<div class="col-xs-6 modal-option enabled {{#if selectedWidgetId}}selected{{/if}}" id="modal-option-edit" data-on-click="show('edit')">
							<h4>widgets settings</h4>
							<p class="description">Setup your widgets</p>
						</div>

						<div class="col-xs-6 modal-option enabled {{#unless selectedWidgetId}}selected{{/unless}}" id="modal-option-search" data-on-click="show('https://localhost:3333/search.html')">
							<h4>search widgets repository</h4>
							{{!-- <p>Share only with your team mates.</p> --}}
							<p class="description">Look for new widget</p>
						</div>
					</div>
				</div>
			</div>

			<div id="modal-detail-edit" class="modal-detail row {{#if selectedWidgetId}}selected{{else}}hidden{{/if}}">
				{{!-- edit widget panel --}}
				<div class="col-xs-8 col-xs-offset-2">
					<div class="col-md-4">
						{{#if-eq dashboard.layout.[0] "tall"}}
						<ul class="sidebar-list">
							<h6>TOP</h6>
							<div id="drag-drop-top">
							{{#each-if dashboard.widgets "display.row" 0}}
								{{#with-hash @root.widgets id}}
									<li class="link {{toggle-class id @root.selectedWidgetId 'selected' ''}}" data-position-widget-id="{{id}}">
										<a href="" data-on-click="showSettings('{{id}}')">{{name}}</a>
									</li>
								{{/with-hash}}
							{{else}}
								<li>empty slot</li>
							{{/each-if}}
							</div>
						</ul>
						{{/if-eq}}

						{{#if-eq dashboard.layout.[1] "short"}}
						<ul class="sidebar-list">
							<h6>MIDDLE</h6>
							<div id="drag-drop-middle">
							{{#each-if dashboard.widgets "display.row" 1}}
								{{#each @root.middleRows}}
									{{#if-eq this ../this.display.position}}
										{{#with-hash @root.widgets ../../this.id}}
											<li class="link {{toggle-class id @root.selectedWidgetId 'selected' ''}}" data-position-widget-id="{{id}}">
												<a href="" data-on-click="showSettings('{{id}}')">{{name}}</a>
											</li>
										{{/with-hash}}
									{{else}}
										<li>empty slot</li>
									{{/if-eq}}
								{{/each}}
							{{/each-if}}
							
							</div>
						</ul>
						{{/if-eq}}

						{{#if-eq dashboard.layout.[2] "tall"}}
						<ul class="sidebar-list">
							<h6>BOTTOM </h6>
							<div id="drag-drop-bottom">
							{{#each-if dashboard.widgets "display.row" 2}}
								{{#with-hash @root.widgets id}}
									<li class="link {{toggle-class id @root.selectedWidgetId 'selected' ''}}" data-position-widget-id="{{id}}">
										<a href="" data-on-click="showSettings('{{id}}')">{{name}}</a>
									</li>
								{{/with-hash}}
							{{else}}
								<li>empty slot</li>
							{{/each-if}}
							<div>
						</ul>
						{{/if-eq}}
					</div>

					{{!-- detail form --}}
					{{#each-if widgets "id" selectedWidgetId}}
						<div id="widget-detail-{{id}}" class="col-xs-8">
							<div class="alert hidden">
								<!-- errors -->
							</div>
							<form class="form-horizontal" id="edit-widget-form">
								{{#each version.general.params as |type settingName|}}
									<div class="form-group">
										<div class="row">
											<div class="col-sm-10 col-sm-offset-1">
												{{#with @root.selectedWidget.settings}}
												<input data-model="{{settingName}}" class="settings form-control input-sm" placeholder="{{settingName}}" type="{{type}}"
													value="{{lookup-property this settingName}}">
												<span id="helpBlock" class="help-block">{{settingName}}</span>
												{{/with}}
											</div>
										</div>
									</div>
								{{/each}}
								<div class="form-group">
									<div class="row">
										<div class="col-sm-7 col-sm-offset-1">
											<select data-model="sourceId" class="settings form-control input-sm">
												{{#unless @root.selectedWidget.sourceId}}
													<option value="undefined" selected>no source selected</option>
												{{/unless}}
												{{#each-if @root.allUserSources "source" version.source.name}}
													<option value="'{{id}}'" {{#if-eq @root.selectedWidget.sourceId id}}selected{{/if-eq}}>
														{{source}} ({{name}})
													</option>
												{{/each-if}}
											</select>
											<span id="helpBlock" class="help-block">source system</span>
										</div>
										<div class="col-sm-3">
											<button type="button" class="btn btn-primary btn-sm" data-on-click="addAccount('{{version.source.name}}')">add account</button>
										</div>
									</div>
								</div>
								<div class="form-actions">
									<button type="button" class="btn btn-primary btn-sm"
										data-on-click="saveChanges()">save changes</button>
									<button type="button" class="btn btn-warning btn-sm"
									data-on-click="removeWidget()">more info on widget</button>
									<button type="button" class="btn btn-danger btn-sm"
									data-on-click="removeWidget()">remove widget</button>
								</div>
							</form>
						</div>
					{{else}}
						hello, anything to setup?
					{{/each-if}}
				</div>
			</div>
		</div>
	</div>
</script>
<script id="ui.modal.new" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="fullscreen-modal">
			<div class="modal-close-button">
				<a href="" class="close" data-on-click="close()"></a>
			</div>

			<div class="row">
				<h3><i class="fa fa-share-alt"></i> make new view</h3>
				<div class="row modal-options">
					<div class="col-xs-8 col-xs-offset-2">
						<div class="col-md-6 modal-option enabled" id="modal-option-my" data-on-click="show('my')">
							<h4>my view</h4>
							<p class="description">Simply create new view</p>
						</div>

						<div class="col-md-6 modal-option enabled" id="modal-option-from" data-on-click="show('from')">
							<h4>from shared</h4>
							<p class="description">Use publicly available URL and save it among your views</p>
						</div>
					</div>
				</div>
			</div>

			<div id="modal-detail-my" class="row modal-detail hidden">
				<div class="col-md-6 col-md-offset-3">
						<div class="alert hidden">
							<!-- errors -->
						</div>
						<form class="form-horizontal" id="edit-dashboard-form">
							<div class="form-group">
								<div class="col-sm-12">
									<input name="name" class="settings form-control" placeholder="put the name here" type="text" data-model="name" value="{{ds.name}}" data-error="SETT_NAME_MISSING_ERR">
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-12">
									<textarea name="desc" class="settings form-control" placeholder="this is my fancy new dashboard" data-model="desc" data-validate="dashboard-description">{{ds.desc}}</textarea>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-12">
									<select data-model="layout" class="form-control">
										<option value="['tall', false, false]">one eye layout</option>
										<option value="['tall', false, 'tall']">two to manage layout</option>
										<option value="[false, 'short', 'tall']">smalls on top layout</option>
										<option value="['tall', 'short', false]">smalls on bottom layout</option>
										<option value="['tall', 'short', 'tall']">full page layout</option>
									</select>
								</div>
							</div>
							<div class="form-actions">
				            	<button type="button" class="btn btn-primary" data-on-click="save()">so be it..</button>
				        	</div>
						</form>
					
				</div>
			</div>

			<div id="modal-detail-from" class="row modal-detail hidden">
				<div class="col-md-6 col-md-offset-3">
					<div class="alert hidden">
						<!-- errors -->
					</div>
					<form class="form-horizontal" id="new-ds-shared">
						<div class="form-group">
							<div class="col-sm-12">
								<input name="url" class="settings form-control" data-model="url" placeholder="enter public view url here (https://...)" data-validate="public-url" value="{{url}}"
									data-error="NEW_SHARED_URL_ERR">
							</div>
						</div>
						<div class="form-actions">
							<button type="button" class="btn btn-primary" data-on-click="saveBaseOnURL()">let's try it</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</script>
<script id="ui.modal.remove" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="fullscreen-modal">
			<div class="modal-close-button">
				<a href="" class="close" data-on-click="close()"></a>
			</div>

			<div class="row">
				<h3><i class="fa fa-trash"></i> remove my view</h3>
			</div>

			<div id="modal-detail-remove" class="row modal-detail">
				<div class="col-md-6 col-md-offset-3">
					<div class="alert hidden">
						<!-- errors -->
					</div>
					<form class="form-horizontal centered" id="new-ds-shared">
						<p>You are about to remove <strong>{{dashboard.name}}</strong> from your views. Are you sure?</p>

						{{#if dashboard.fromShared}}
							<p>This view is shared, so only your instance will be removed.</p>
						{{/if}}

						<p>&nbsp;</p>

						<button type="button" class="btn btn-danger" data-on-click="remove()">remove {{dashboard.name}}</button>
					</form>
				</div>
			</div>
		</div>
	</div>



</script>
<script id="ui.modal.settings" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="fullscreen-modal">
			<div class="modal-close-button">
				<a href="" class="close" data-on-click="close()"></a>
			</div>

			<div class="row">
				<h3><i class="fa fa-cogs"></i> update settings</h3>
				{{!-- <div class="row modal-options">
					<div class="col-xs-8 col-xs-offset-2">
						<div class="col-md-6 modal-option enabled" id="modal-option-my" data-on-click="show('my')">
							<h4>my view</h4>
							<p class="description">Simply create new view</p>
						</div>

					</div>
				</div> --}}
			</div>

			<div id="modal-detail-settings" class="row modal-detail">
				<div class="col-md-6 col-md-offset-3">
					<div class="alert hidden">
						<!-- errors -->
					</div>
					<form class="form-horizontal" id="settings-dashboard-form">
						<div class="form-group">
							<div class="col-sm-12">
								<input class="settings form-control" placeholder="put the name here" type="text" data-model="name" value="{{ds.name}}" data-error="SETT_NAME_MISSING_ERR">
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-12">
								<textarea class="settings form-control" placeholder="this is my fancy new dashboard" data-model="desc" data-validate="dashboard-description">{{ds.desc}}</textarea>
							</div>
						</div>
						<div class="form-actions">
							<button type="button" class="btn btn-primary" data-on-click="update()">Update</button>
						</div>
					</form>
					
				</div>
			</div>
		</div>
	</div>
</script>
<script id="ui.modal.share" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="fullscreen-modal">
			<div class="modal-close-button">
				<a href="" class="close" data-on-click="close()"></a>
			</div>
			<div class="row">
				<h3><i class="fa fa-share-alt"></i> share your view</h3>
				<div class="row modal-options">
					<div class="col-xs-8 col-xs-offset-2">
						<div class="col-md-4 modal-option enabled {{toggle-class ds.shared 'public' 'selected'}}" id="modal-option-public" data-on-click="show('public')">
							<h4>publicly</h4>
							<p class="description">Share via <strong>publicly available link</strong>. Anyone will be able to see the view.</p>
						</div>

						<div class="col-md-4 modal-option disabled">
							<h4>privately</h4>
							<p class="description"><br>AVAILABLE SOONER</p>
						</div>

						<div class="col-md-4 modal-option disabled last">
							<h4>as template</h4>
							<p class="description"><br>AVAILABLE SOON</p>
						</div>
					</div>
				</div>
			</div>

			<div id="modal-detail-public" class="modal-detail row {{toggle-class ds.shared 'public' 'displayed' 'hidden'}}">
				<div class="col-md-6 col-md-offset-3">
					<div class="alert hidden">
						<!-- errors -->
					</div>
					<form class="form-horizontal centered">
						{{#if ds.shared}}
							<p>Your view is available to anyone at this URL:<br>
							<a href="https://anylarch.com/public/{{ds.id}}" target="_blank">https://anylarch.com/public/{{ds.id}}</a></p>
							<button type="button" class="btn btn-danger" data-on-click="removeShared()">remove sharing</button>
						{{else}}
							<p>Immediatelly, after sharing the view, your view will be hourly updated to provide other users the latest data.</p>
							<button type="button" class="btn btn-primary" data-on-click="sharePublic()">make my view public</button>
						{{/if}}
					</form>
				</div>
			</div>
		</div>
	</div>
</script>
<script id="ui.modal.user" type="text/x-handlebars-template">
	<div class="modal larch-modal">
		<div class="fullscreen-modal">
			<div class="modal-close-button">
				<a href="" class="close" data-on-click="close()"></a>
			</div>
			<div class="row">
				<h3><i class="fa fa-user"></i> user profile</h3>
				<div class="row modal-options">
					<div class="col-xs-8 col-xs-offset-2">
						<div class="col-md-4 modal-option enabled" id="modal-option-profile" data-on-click="show('profile')">
							<h4>settings</h4>
							<p class="description">Modify my settings</p>
						</div>

						<div class="col-md-4 modal-option enabled" id="modal-option-accounts" data-on-click="show('accounts')">
							<h4>source accounts</h4>
							<p class="description">View all my source accounts</p>
						</div>

						<div class="col-md-4 modal-option enabled" id="modal-option-password" data-on-click="show('password')">
							<h4>change password</h4>
							<p class="description">Change my password</p>
						</div>
					</div>
				</div>
			</div>
			
			
			<div id="modal-detail-profile" class="row modal-detail hidden">
				<div class="col-md-6 col-md-offset-3">
					<div class="alert hidden">
						<!-- errors -->
					</div>
					<form class="form-horizontal" id="profile-edit-form">
						<div class="form-group">
							<div class="col-sm-10 col-sm-offset-1">
								<div class="checkbox">
									<label>
										<input type="checkbox" data-model="allowEmails" checked>
										Anylarch.com can send me newsletters over e-mail
									</label>
								</div>
							</div>
						</div>
						<div class="form-actions">
				            <button class="btn btn-primary" data-on-click="save('profile-edit-form')">update</button>
				        </div>
					</form>
				</div>
			</div>

			<div id="modal-detail-accounts" class="row modal-detail hidden">
				<div class="col-md-6 col-md-offset-3">
					<div class="alert hidden">
						<!-- errors -->
					</div>
					
					{{#if user.sources.length}}
						<table class="table table-striped">
							<thead>
								<tr>
									<th>source</th>
									<th>account</th>
									<th>date</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{{#each user.sources}}
									<tr>
										<td>{{this.source}}</td>
										<td>{{this.name}}</td>
										<td>{{format-date this.createdAt}}</td>
										<td>
											<button type="button" class="btn btn-danger btn-xs" data-on-click="removeAccount('{{this.id}}')">
												<i class="fa fa-times"></i>
											</button>
										</td>
									</tr>
								{{/each}}
							</tbody>
						</table>
					{{else}}
						<p>no sources so far...</p>
					{{/if}}
				</div>
			</div>

			<div id="modal-detail-password" class="row modal-detail hidden">
				<div class="col-md-6 col-md-offset-3">
					<div class="alert hidden">
						<!-- errors -->
					</div>
					<form class="form-horizontal" id="new-ds-shared">
						<div class="form-group">
				            <input type="text" placeholder="current password" data-model="oldPassword" class="form-control" required value=""/>
				        </div>
				        <div class="form-group" >
				            <input type="password" placeholder="new password" data-model="password" class="form-control" required value=""/>
				        </div>
				        <div class="form-group" >
				            <input type="password" placeholder="confirm new password" data-model="confirmPassword" class="form-control" required value="" />
				        </div>
				        <div class="form-actions">
				            <button class="btn btn-primary" data-on-click="updatePass()">update</button>
				        </div>
					</form>
				</div>
			</div>

		</div>
	</div>
</script>
<script id="ui.register" type="text/x-handlebars-template">
    <h2>register</h2>
    {{#if error}}
        <div class="alert alert-danger">{{{error}}}</div>
    {{/if}}
    <form name="form" role="form" id="register-form">
        <div class="form-group">
            <input type="text" placeholder="e-mail" data-model="username" class="form-control" required value="stepan@anylarch.com"/>
        </div>
        <div class="form-group" >
            <input type="password" placeholder="password" data-model="password" class="form-control" required value="12345Aa"/>
        </div>
        <div class="form-group" >
            <input type="password" placeholder="confirm password" data-model="confirmPassword" class="form-control" required value="12345Aa" />
        </div>
        <div class="form-actions">
            <button class="btn btn-primary" data-on-click="register()">register</button>
        </div>
    </form>
</script>
<script id="ui.sidebar" type="text/x-handlebars-template">
	<ul class="sidebar-list">
		<h6>I LIKE</h6>
		{{#each-if dashboards "like" true}}
			<li class="link {{toggle-class this.id @root.route 'selected'}}">
				<a href="" data-on-click="navigate('/dashboard/{{this.id}}')">{{this.name}}
					{{#if this.shared}}
						<span class="shared" title="this view is shared with many happy people"><i class="fa fa-share-alt"></i></span>
					{{/if}}
				</a>

				{{#if-eq this.id @root.route}}
					<span class="desc">{{max-char this.desc 30}}</span>
				{{/if-eq}}
			</li>
		{{else}}
			{{#random-text}}
				<li>you're right... hate the world</li>
				<li>love is like a bee...</li>
				<li>to like or to hate?</li>
				<li>shouldn't you like someone</li>
			{{/random-text}}
		{{/each-if}}
	</ul>

	<ul class="sidebar-list">
		<h6>SHARED WITH ME</h6>
		{{#each-if dashboards "fromShared" true}}
			<li class="link {{toggle-class this.id @root.route 'selected'}}">
				<a href="" data-on-click="navigate('/dashboard/{{this.id}}')">{{this.name}}</a>

				{{#if-eq this.id @root.route}}
					<span class="desc">{{max-char this.desc 30}}</span>
				{{/if-eq}}
			</li>
		{{else}}
			{{#random-text}}
				<li>hey, are you talking to anyone?</li>
				<li>does anybody like you?</li>
				<li>hmm.... boy or girl?</li>
				<li>no facebook? no twitter?</li>
			{{/random-text}}
		{{/each-if}}
	</ul>


	<ul class="sidebar-list">
		<h6>THE OTHERS</h6>
		{{#each-if dashboards "like" false}}
			{{#if this.fromShared}}
			{{else}}
				<li class="link {{toggle-class this.id @root.route 'selected'}}">
					<a href="" data-on-click="navigate('/dashboard/{{this.id}}')">{{this.name}}
						{{#if this.shared}}
							<span class="shared" title="this view is shared with many happy people"><i class="fa fa-share-alt"></i></span>
						{{/if}}
					</a>
					{{#if-eq this.id @root.route}}
						<span class="desc">{{max-char this.desc 30}}</span>
					{{/if-eq}}
				</li>
			{{/if}}
		{{else}}
			{{#random-text}}
				<li>what about a new view?</li>
				<li>would you like to see something?</li>
				<li>Time to see and lead...</li>
			{{/random-text}}
		{{/each-if}}
	</ul>
</script>