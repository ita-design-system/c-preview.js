// IPREVIEW
// A JS library to display data from input type=file
const ipreview = {
    reset: function(input_id) {
        if (typeof input_id == 'string') {
            const el_input_file_target = document.getElementById(input_id);
            const el_ipreview_container = document.querySelector('[data-ipreview="'+input_id+'"]');
            if (el_input_file_target !== null) {
                el_input_file_target.value = '';
            }
            if (el_ipreview_container !== null) {
                el_ipreview_container.innerHTML = '';
            }
        }
    },
    // Bytes user friendly display 
    // Based on https://stackoverflow.com/a/18650828
    formatBytes: function(bytes, decimals = 2, lang = 'fr') {
        const sizes = {
            fr: ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'],
            en: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        }
        if (!+bytes) return '0';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[lang][i]}`
    },
    // Remove a file from input and preview
    remove: function(el, file_name) {
        const el_ipreview_container = el.closest('[data-ipreview]');
        const el_ipreview_item = el.closest('.ipreview-item');
        const input_file_id = el_ipreview_container.dataset.ipreview;
        let name = file_name;
        // Supprimer l'affichage du nom de fichier
        el_ipreview_item.remove();
        for (let i = 0; i < ipreview._dataTransfers[input_file_id].items.length; i++) {
            // Correspondance du fichier et du nom
            if(name === ipreview._dataTransfers[input_file_id].items[i].getAsFile().name) {
                // Suppression du fichier dans l'objet DataTransfer
                ipreview._dataTransfers[input_file_id].items.remove(i);
                continue;
            }
        }

        const el_input_file = document.getElementById(input_file_id);
        // Mise à jour des fichiers de l'input file après suppression
        el_input_file.files = ipreview._dataTransfers[input_file_id].files; 
        // If no more file, remove reset button
        if (el_input_file.files.length == 0) {
            const el_ipreview_remove_all = el_ipreview_container.querySelector('.ipreview-remove');
            if (el_ipreview_remove_all !== null) {
                el_ipreview_remove_all.remove();
            }
        }
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
                if (typeof data == 'object') {
                    if (typeof data.id == 'string' && typeof data.el_target_container == 'object') {
                        data.el_target_container.insertAdjacentHTML(
                            'beforeend',
                            `<button onclick="ipreview.reset('${data.id}')">Remove all</button>`
                        );
                    }
                }
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
                if (typeof data == 'object') {
                    if (typeof data.e == 'object' && typeof data.el_file == 'object' && typeof data.el_target_container == 'object') {
                        // Create thumb item
                        const el_item = document.createElement('div');
                        el_item.innerHTML = `
                        <ul>
                            <li>File name: ${data.el_file.name}</li>
                            <li>Size: ${ipreview.formatBytes(data.e.loaded)}</li>
                            <li>Type: ${data.el_file.type}</li>
                            <li><button onclick="ipreview.remove(this, '${data.el_file.name}')">Supprimer</button></li>
                        </ul>`;
                        // Insert file markup
                        data.el_target_container.appendChild(el_item);
                    }
                }
            }
        }
    },
    update: function(el) {
        if (typeof el == 'object') {
            // Container element [data-ipreview="<ID_OF_INPUT_FILE>"]
            const el_target_container = document.querySelector('[data-ipreview="'+el.id+'"]');
            if (el_target_container !== null && el.files.length > 0) {
                el_target_container.innerHTML = '';
                // Remove files/reset command
                // Get user defined template
                const user_defined_reset_template_name = el_target_container.dataset.ipreviewTemplateReset;
                // Arguments to send to template generator
                const reset_data = {
                    el_target_container: el_target_container,
                    id: el.id
                }

                // If valid reset template
                let valid_user_defined_reset_template_name = false;
                if (user_defined_reset_template_name !== undefined) {
                    if (typeof ipreviewTemplates == 'object') {
                        if (typeof ipreviewTemplates.reset == 'object') {
                            if (typeof ipreviewTemplates.reset[user_defined_reset_template_name] == 'function') {
                                valid_user_defined_reset_template_name = true;
                                ipreviewTemplates.reset[user_defined_reset_template_name](reset_data);
                            }
                        }
                    }
                }
                // If no valid custom template, use default
                if (!valid_user_defined_reset_template_name) {
                    ipreview.templates.reset.default(reset_data);
                    // console.log('no valid reset template, using default');
                }
                // To handle add/remove on input type file woth multiple attribute
                ipreview._dataTransfers[el.id] = new DataTransfer();
                // Create thumbs/files items
                for (let el_file of el.files) {
                    // Add current file into its own DataTransfer
                    ipreview._dataTransfers[el.id].items.add(el_file);
                    // Sync input file
                    el.files = ipreview._dataTransfers[el.id].files;
                    // Init file reader for images
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Get user defined template
                        const user_defined_file_template_name = el_target_container.dataset.ipreviewTemplateFile;
                        // Arguments to send to template generator
                        const file_data = {
                            el_target_container: el_target_container,
                            el_file: el_file,
                            e: e
                        }
                        // If valid file template
                        let valid_user_defined_file_template_name = false;
                        if (user_defined_file_template_name !== undefined) {
                            if (typeof ipreviewTemplates == 'object') {
                                if (typeof ipreviewTemplates.file == 'object') {
                                    if (typeof ipreviewTemplates.file[user_defined_file_template_name] == 'function') {
                                        valid_user_defined_file_template_name = true;
                                        ipreviewTemplates.file[user_defined_file_template_name](file_data);
                                    }
                                }
                            }
                        }
                        // If no valid custom template, use default
                        if (!valid_user_defined_file_template_name) {
                            ipreview.templates.file.default(file_data);
                            // console.log('no valid file template, using default');
                        }
                        // Mark each file item with a specific class
                        el_target_container.childNodes.forEach(function(el_target_item, item_index) {
                            // Avoid first child which is always the remove all files button
                            if (item_index == 0) {
                                el_target_item.classList.add('ipreview-remove');
                            } else {
                                el_target_item.classList.add('ipreview-item');
                            }
                        });
                        // console.log(file_markup);
                    }
                    // Convert to base64 string
                    reader.readAsDataURL(el_file);
                };
            }
        }
    }
}