window.addEventListener("load", function() {
	if (application && nabu && nabu.page) {
		Vue.component("page-form-input-qr-configure", {
			template: "<n-form-section>"
				+ "	<n-form-switch v-model='field.allowManualEntry' label='Allow manual entry' />"
				+ "	<n-form-text type='number' v-model='field.canvasWidth' label='Width (in pixels)' />"
				+ "	<n-form-text type='number' v-model='field.canvasHeight' label='Height (in pixels)' />"
				+ "	<n-form-text v-model='field.icon' label='Icon' />"
				+ "	<n-form-text v-model='field.buttonLabel' label='Buton Label' />"
				+ "	<n-form-switch v-model='field.manualEntry' label='Manual Entry' />"
				+ "	<n-form-text v-if='field.manualEntry' v-model='field.manualLabel' label='Manual Label' />"
				+ "	<n-page-mapper v-model='field.bindings' :from='availableParameters' :to='[\"validator\"]'/>"
				+ "</n-form-section>",
			props: {
				cell: {
					type: Object,
					required: true
				},
				page: {
					type: Object,
					required: true
				},
				// the fragment this image is in
				field: {
					type: Object,
					required: true
				}
			},
			created: function() {
				if (!this.field.bindings) {
					Vue.set(this.field, "bindings", {});
				}
			},
			computed: {
				availableParameters: function() {
					return this.$services.page.getAvailableParameters(this.page, this.cell, true);
				}
			}
		});

		Vue.component("page-form-input-qr", {
			template: "<n-form-qr :allow-manual='field.allowManualEntry' ref='form'"
				+ "	:schema='schema'"
				+ "	@input=\"function(newValue) { $emit('input', newValue) }\""
				+ "	:label='label'"
				+ "	:value='value'"
				+ "	:name='field.name'"
				+ "	:timeout='timeout'"
				+ "	:validator='getValidator()'"
				+ "	:width='field.canvasWidth'"
				+ "	:height='field.canvasHeight'"
				+ "	:button-label='$services.page.translate($services.page.interpret(field.buttonLabel, $self))'"
				+ "	:manual-label='$services.page.translate($services.page.interpret(field.manualLabel, $self))'"
				+ "	:placeholder='placeholder ? $services.page.translate($services.page.interpret(placeholder, $self)) : null'"
				+ "	:icon='field.icon'"
				+ "	:disabled='disabled'/>",
			props: {
				cell: {
					type: Object,
					required: true
				},
				page: {
					type: Object,
					required: true
				},
				field: {
					type: Object,
					required: true
				},
				value: {
					required: true
				},
				label: {
					type: String,
					required: false
				},
				timeout: {
					required: false
				},
				disabled: {
					type: Boolean,
					required: false
				},
				schema: {
					type: Object,
					required: false
				},
				readOnly: {
					type: Boolean,
					required: false
				},
				placeholder: {
					type: String,
					required: false
				}
			},
			computed: {
				textType: function() {
					return this.field.textType ? this.field.textType : 'text';
				}
			},
			methods: {
				validate: function(soft) {
					return this.$refs.form.validate(soft);
				},
				getValidator: function() {
					if (this.field.bindings && this.field.bindings.validator) {
						var pageInstance = this.$services.page.getPageInstance(this.page, this);
						return this.$services.page.getBindingValue(pageInstance, this.field.bindings.validator, this);
					}
				}
			}
		});
		application.bootstrap(function($services) {
			nabu.page.provide("page-form-input", { 
				component: "page-form-input-qr", 
				configure: "page-form-input-qr-configure", 
				name: "qr",
				namespace: "nabu.page"
			});
		});
	}
});    