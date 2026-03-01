/**
 * Handles the checkbox interactions for the NLP model tree
 * The checkbox logic was already present in analysis.js but it made more sense to extract it
 */
export class NlpModelTreeController {
    /**
     * Constructor for the NLP model tree controller
     */
    constructor(root, fieldConfig) {
        this.root = root;
        this.fieldConfig = fieldConfig || {};
        this.initTreeToggles();
        this.initMasterCheckbox();
        this.initNlpGroupCheckboxes();
        this.initNlpModelCheckboxes();
        this.initTtlabCheckboxes();
    }

    /**
     * Attaches click event listeners to tree-toggle elements to toggle nested lists
     */
    initTreeToggles() {
        this.root.querySelectorAll('.tree-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'label') return;
                const parent = toggle.parentElement;
                const nested = parent.querySelector('.nested');
                const icon = toggle.querySelector('.toggle-icon');
                if (nested) nested.classList.toggle('active');
                if (icon) icon.classList.toggle('open');
            });
        });
    }

    /**
     * Attaches event listeners on to the "master" checkbox s.t. all others checkboxes can be simultaneously toggled
     */
    initMasterCheckbox() {
        this.masterCheckbox = this.root.querySelector('#all-analysis-models-checkbox');
        if (!this.masterCheckbox) return;

        this.masterCheckbox.addEventListener('change', () => {
            const all = this.root.querySelectorAll(
                '.nlp-group-checkbox, .nlp-model-checkbox, .ttlab-group-checkbox, .ttlab-subgroup-checkbox, .ttlab-model-checkbox'
            );
            all.forEach(cb => { if (!cb.disabled) cb.checked = this.masterCheckbox.checked; });
            this.root.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.indeterminate = false);
            this.updateAllFieldVisibilities();
        });
    }

    /**
     * Attaches event listeners to each individual NLP "family" checkbox
     */
    initNlpGroupCheckboxes() {
        this.root.querySelectorAll('.nlp-group-checkbox').forEach(groupCb => {
            groupCb.addEventListener('change', (e) => {
                const groupItem = groupCb.closest('li');
                groupItem.querySelectorAll('.nlp-model-checkbox').forEach(cb => {
                    if (!cb.disabled) cb.checked = groupCb.checked;
                });
                this.updateNlpGroupState(groupCb);
                this.updateAllFieldVisibilities();
                e.stopPropagation();
            });
        });
    }

    /**
     * Attaches event listeners to each individual model checkbox
     */
    initNlpModelCheckboxes() {
        this.root.querySelectorAll('.nlp-model-checkbox').forEach(modelCb => {
            modelCb.addEventListener('change', (e) => {
                this.updateNlpGroupState(modelCb);
                this.updateAllFieldVisibilities();
                e.stopPropagation();
            });
        });
    }

    /**
     * Attaches event listeners to the TTLab checkboxes
     */
    initTtlabCheckboxes() {
        this.root.querySelectorAll('.ttlab-group-checkbox, .ttlab-subgroup-checkbox').forEach(groupCb => {
            groupCb.addEventListener('change', (e) => {
                const groupItem = groupCb.closest('li');
                groupItem.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (!cb.disabled) cb.checked = groupCb.checked;
                });
                this.updateTtlabParentStates(groupCb);
                this.updateMasterCheckbox();
                this.updateAllFieldVisibilities();
                e.stopPropagation();
            });
        });

        this.root.querySelectorAll('.ttlab-model-checkbox').forEach(modelCb => {
            modelCb.addEventListener('change', (e) => {
                this.updateTtlabParentStates(modelCb);
                this.updateMasterCheckbox();
                this.updateAllFieldVisibilities();
                e.stopPropagation();
            });
        });
    }

    /**
     * Updates the checked/unchecked state of an nlp-group checkbox based on its children's state
     */
    updateNlpGroupState(changedCb) {
        const groupItem = changedCb.closest('ol.nested')?.closest('li');
        if (!groupItem) return;
        const groupCb = groupItem.querySelector('.nlp-group-checkbox');
        const models = groupItem.querySelectorAll('.nlp-model-checkbox');

        const allChecked = Array.from(models).every(cb => cb.checked);
        const noneChecked = Array.from(models).every(cb => !cb.checked);

        if (allChecked) { groupCb.checked = true; groupCb.indeterminate = false; }
        else if (noneChecked) { groupCb.checked = false; groupCb.indeterminate = false; }
        else { groupCb.checked = false; groupCb.indeterminate = true; }

        this.updateMasterCheckbox();
    }

    /**
     * Updates the master's checkbox state based on the state of all its children
     */
    updateMasterCheckbox() {
        if (!this.masterCheckbox) return;
        const groups = this.root.querySelectorAll('.nlp-group-checkbox, .ttlab-group-checkbox');
        const total = groups.length;
        const checked = Array.from(groups).filter(cb => cb.checked).length;
        const indeterminate = Array.from(groups).some(cb => cb.indeterminate);

        if (checked === total && !indeterminate) {
            this.masterCheckbox.checked = true; this.masterCheckbox.indeterminate = false;
        } else if (checked === 0 && !indeterminate) {
            this.masterCheckbox.checked = false; this.masterCheckbox.indeterminate = false;
        } else {
            this.masterCheckbox.checked = false; this.masterCheckbox.indeterminate = true;
        }
    }

    /**
     * Updates the TTLab parent's state based on its children's states
     */
    updateTtlabParentStates(checkbox) {
        let current = checkbox.closest('ul.nested, ol.nested');
        while (current) {
            const parentLi = current.closest('li');
            const parentCb = parentLi?.querySelector('input[type="checkbox"]:not(.ttlab-model-checkbox)');

            if (parentCb) {
                const relevantCbs = current.querySelectorAll('input[type="checkbox"]');
                const children = Array.from(relevantCbs).filter(cb => cb !== parentCb);

                const allChecked = children.every(cb => cb.checked);
                const noneChecked = children.every(cb => !cb.checked);

                if (allChecked) { parentCb.checked = true; parentCb.indeterminate = false; }
                else if (noneChecked) { parentCb.checked = false; parentCb.indeterminate = false; }
                else { parentCb.checked = false; parentCb.indeterminate = true; }
            }
            current = parentLi?.closest('ul.nested, ol.nested');
        }
    }

    /**
     * Updates visibility of fields based on the currently checked models
     */
    updateAllFieldVisibilities() {
        for (const [keyword, config] of Object.entries(this.fieldConfig)) {
            this.updateFieldVisibility(keyword, config.wrapperId, config.inputId);
        }
    }

    /**
     * Updates a field's visibility based on whether a checked model's ID contains the keyword
     */
    updateFieldVisibility(keyword, wrapperId, inputId) {
        const checkboxes = this.root.querySelectorAll('.nlp-model-checkbox, .ttlab-model-checkbox');
        const anyChecked = Array.from(checkboxes).some(cb => cb.id.toLowerCase().includes(keyword) && cb.checked);
        const wrapper = document.getElementById(wrapperId);
        if (wrapper) {
            wrapper.style.display = anyChecked ? 'block' : 'none';
            if (!anyChecked) {
                const input = document.getElementById(inputId);
                if (input) input.value = '';
            }
        }
    }

    /**
     * Returns the IDs of all checked model checkboxes
     */
    getSelectedModels() {
        const checked = this.root.querySelectorAll('.nlp-model-checkbox:checked, .ttlab-model-checkbox:checked');
        return Array.from(checked).map(cb => cb.id);
    }

    /**
     * Returns the text inputs for models that require them (e.g. claim, cohesion, stance, llm)
     */
    getSpecialInputs() {
        const get = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
        return {
            inputClaim: get(this.fieldConfig.factchecking?.inputId || ''),
            inputCoherence: get(this.fieldConfig.cohesion?.inputId || ''),
            inputStance: get(this.fieldConfig.stance?.inputId || ''),
            inputLLM: get(this.fieldConfig.llm?.inputId || '')
        };
    }

    /**
     * Checks whether any checked model's ID contains the given keyword
     */
    hasModelType(keyword) {
        const checkboxes = this.root.querySelectorAll('.nlp-model-checkbox:checked, .ttlab-model-checkbox:checked');
        return Array.from(checkboxes).some(cb => cb.id.toLowerCase().includes(keyword));
    }
}