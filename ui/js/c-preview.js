// CPREVIEW v0.2.2
// A JS library to display data from input type=file
const cPreview = {
    /**
     * RESET METHOD
     * Remove all files from the specified input type file
     * @param {String} input_id token name of the translation string
     */
    reset: function(input_id) {
        if (typeof input_id == 'string') {
            const el_input_file_target = document.getElementById(input_id);
            const el_cpreview_container = document.querySelector('[data-cpreview="'+input_id+'"]');
            if (el_input_file_target !== null) {
                el_input_file_target.value = '';
            }
            if (el_cpreview_container !== null) {
                el_cpreview_container.innerHTML = '';
            }
        }
    },
    // Bytes user friendly display 
    // Based on https://stackoverflow.com/a/18650828
    formatBytes: function(bytes, lang = 'en', decimals = 2) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        if (!+bytes) return '0';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const text = cPreview.getLanguageString('bytes_'+i, lang) || sizes[i];
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${text}`
    },
    // Remove a file from input and preview
    remove: function(el, file_name) {
        const el_cpreview_container = el.closest('[data-cpreview]');
        const el_cpreview_item = el.closest('.cpreview-item');
        const input_file_id = el_cpreview_container.dataset.cpreview;
        let name = file_name;
        // Supprimer l'affichage du nom de fichier
        el_cpreview_item.remove();
        for (let i = 0; i < cPreview._dataTransfers[input_file_id].items.length; i++) {
            // Correspondance du fichier et du nom
            if(name === cPreview._dataTransfers[input_file_id].items[i].getAsFile().name) {
                // Suppression du fichier dans l'objet DataTransfer
                cPreview._dataTransfers[input_file_id].items.remove(i);
                continue;
            }
        }

        const el_input_file = document.getElementById(input_file_id);
        // Mise à jour des fichiers de l'input file après suppression
        el_input_file.files = cPreview._dataTransfers[input_file_id].files; 
        // If no more file, remove reset button
        if (el_input_file.files.length == 0) {
            const el_cpreview_remove_all = el_cpreview_container.querySelector('.cpreview-remove');
            if (el_cpreview_remove_all !== null) {
                el_cpreview_remove_all.remove();
            }
        }
    },
    /**
     * OPTIONAL LANGUAGE STRING METHOD
     * @param {String} token token name of the translation string
     * @param {String} current_lang language invoked 
     * @return {String} for a valid token + language or {undefined} is not
     * More info at https://github.com/ita-design-system/c-preview.js
     */
    getLanguageString: function(token, current_lang) {
        let result = undefined;
        if (typeof current_lang == 'string' && typeof token == 'string') {
            if (typeof cPreviewI18n == 'object') {
                if (typeof cPreviewI18n[current_lang][token] == 'string') {
                    result = cPreviewI18n[current_lang][token];
                }
            }
        }
        return result;
    },
    // DataTransfer to handle files
    // One dataTransfer / input file
    _dataTransfers: {},
    // Templates
    templates: {
        reset: {
            /**
             * DEFAULT TEMPLATE FOR REMOVE ALL FILES BUTTON
             * @param {Object} data 
             * @param {Object} data.el_target_container DOM element if the file item
             * @param {String} data.id input type file id to reset
             */
            default: function(data) {
                const current_lang = data.el_target_container.dataset.cpreviewI18n;
                data.el_target_container.insertAdjacentHTML(
                    'beforeend',
                    `<nav style="width:100%"><button onclick="cPreview.reset('${data.id}')">${cPreview.getLanguageString('remove_all', current_lang) || 'Remove all'}</button></nav>`
                );
            }
        },
        file: {
            /**
             * DEFAULT TEMPLATE FOR FILE ITEM
             * @param {Object} data 
             * @param {Object} data.el_target_container DOM element if the file item
             * @param {Object} data.e Reader onload event
             * @param {Object} data.el_file File List element
             */
            default: function(data) {
                // Create thumb item
                const el_item = document.createElement('div');
                const current_lang = data.el_target_container.dataset.cpreviewI18n;
                el_item.innerHTML = `
                <ul>
                    <li>${cPreview.getLanguageString('file_name', current_lang) || 'File name'}: ${data.el_file.name}</li>
                    <li>${cPreview.getLanguageString('file_size', current_lang) || 'File size'}: ${cPreview.formatBytes(data.e.loaded, current_lang)}</li>
                    <li>${cPreview.getLanguageString('file_type', current_lang) || 'File type'}: ${data.el_file.type}</li>
                    <li>
                        <button onclick="cPreview.remove(this, '${data.el_file.name}')">
                            ${cPreview.getLanguageString('remove', current_lang) || 'Remove'}
                        </button>
                    </li>
                </ul>`;
                // Insert file markup
                data.el_target_container.appendChild(el_item);
            }
        }
    },
    /**
     * HANDLER METHOD FOR INPUT FILE CHANGE
     * Job to do on each elligible input type file
     * @param {Object} e - Event sent by input 
     */
    _run: function(e) {
        // Input file element
        const el = e.target;
        // Container element [data-cpreview="<ID_OF_INPUT_FILE>"]
        const el_target_container = document.querySelector('[data-cpreview="'+el.id+'"]');
        if (el.files.length > 0 && el_target_container !== null) {
            el_target_container.innerHTML = '';
            // Remove files/reset command
            // Get user defined template
            const user_defined_reset_template_name = el_target_container.dataset.cpreviewTemplateReset;
            // Arguments to send to template generator
            const reset_data = {
                el_target_container: el_target_container,
                id: el.id
            }

            // If valid reset template
            let valid_user_defined_reset_template_name = false;
            if (user_defined_reset_template_name !== undefined) {
                if (typeof cPreviewTemplates == 'object') {
                    if (typeof cPreviewTemplates.reset == 'object') {
                        if (typeof cPreviewTemplates.reset[user_defined_reset_template_name] == 'function') {
                            valid_user_defined_reset_template_name = true;
                            cPreviewTemplates.reset[user_defined_reset_template_name](reset_data);
                        }
                    }
                }
            }
            // If no valid custom template, use default
            if (!valid_user_defined_reset_template_name) {
                cPreview.templates.reset.default(reset_data);
                // console.log('no valid reset template, using default');
            }
            // To handle add/remove on input type file woth multiple attribute
            cPreview._dataTransfers[el.id] = new DataTransfer();
            // Create thumbs/files items
            for (let el_file of el.files) {
                // Add current file into its own DataTransfer
                cPreview._dataTransfers[el.id].items.add(el_file);
                // Sync input file
                el.files = cPreview._dataTransfers[el.id].files;
                // Init file reader for images
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Get user defined template
                    const user_defined_file_template_name = el_target_container.dataset.cpreviewTemplateFile;
                    // Arguments to send to template generator
                    const file_data = {
                        el_target_container: el_target_container,
                        el_file: el_file,
                        e: e
                    }
                    // If valid file template
                    let valid_user_defined_file_template_name = false;
                    if (user_defined_file_template_name !== undefined) {
                        if (typeof cPreviewTemplates == 'object') {
                            if (typeof cPreviewTemplates.file == 'object') {
                                if (typeof cPreviewTemplates.file[user_defined_file_template_name] == 'function') {
                                    valid_user_defined_file_template_name = true;
                                    cPreviewTemplates.file[user_defined_file_template_name](file_data);
                                }
                            }
                        }
                    }
                    // If no valid custom template, use default
                    if (!valid_user_defined_file_template_name) {
                        cPreview.templates.file.default(file_data);
                        // console.log('no valid file template, using default');
                    }
                    // Mark each file item with a specific class
                    Object.keys(el_target_container.children).forEach(function(index) {
                        // Avoid first child which is always the remove all files button
                        if (index == '0') {
                            el_target_container.children[index].classList.add('cpreview-remove');
                        } else {
                            el_target_container.children[index].classList.add('cpreview-item');
                        }
                    })
                }
                // Convert to base64 string
                reader.readAsDataURL(el_file);
            };
        }
    },
    update: function() {
        document.querySelectorAll('input[type="file"]').forEach(function(el) {
            el.addEventListener('change', cPreview._run);
        });
    }
}
cPreview.update();
