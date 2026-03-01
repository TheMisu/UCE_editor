<div class="treeview-wrapper">
    <ul class="analysis-treeview">
        <li>
            <div class="tree-toggle">
                <i class="toggle-icon"></i>
                <input type="checkbox" id="all-analysis-models-checkbox" />
                <label class="group-label" for="all-analysis-models-checkbox">${languageResource.get("models")}</label>
            </div>
            <ul class="nested">
                <#list modelGroups as group>
                    <li>
                        <div class="tree-toggle">
                            <i class="toggle-icon"></i>
                            <input type="checkbox" class="nlp-group-checkbox analysis-group-checkbox" id="group_${group_index}" />
                            <label class="analysis-group-label" for="group_${group_index}">${group.name} (${group.models?size})</label>
                        </div>
                        <ol class="nested">
                            <#list group.models as model>
                                <li>
                                    <div class="model-item">
                                        <label for="${group.name?replace(" ", "_")}_${model.key?replace(" ", "_")}">
                                            <input type="checkbox" class="nlp-model-checkbox analysis-model-checkbox" id="${group.name?replace(" ", "_")}_${model.key?replace(" ", "_")}" />
                                            ${model.name!model.key}
                                        </label>
                                    </div>
                                </li>
                            </#list>
                        </ol>
                    </li>
                </#list>

                <li>
                    <div class="tree-toggle">
                        <i class="toggle-icon"></i>
                        <input type="checkbox" class="ttlab-group-checkbox analysis-group-checkbox" id="group_ttlab_scorer" />
                        <label class="analysis-group-label" for="group_ttlab_scorer">TTLAB Scorer (${ttlabScorer?size})</label>
                    </div>
                    <ul class="nested">
                        <#list ttlabScorer?keys as models>
                            <#assign submodels = ttlabScorer[models]>
                            <li>
                                <div class="tree-toggle">
                                    <i class="toggle-icon"></i>
                                    <input type="checkbox" class="ttlab-subgroup-checkbox analysis-group-checkbox" id="group_${models?index}" />
                                    <label class="analysis-group-label" for="group_${models?index}">${models} (${submodels?size})</label>
                                </div>
                                <ul class="nested">
                                    <#list submodels?keys as properties>
                                        <#assign property = submodels[properties]>
                                        <li>
                                            <div class="tree-toggle">
                                                <i class="toggle-icon"></i>
                                                <input type="checkbox" class="ttlab-subgroup-checkbox analysis-group-checkbox" id="subgroup_${properties?index}" />
                                                <label class="analysis-group-label" for="subgroup_${properties?index}">${properties} (${property?size})</label>
                                            </div>
                                            <ol class="nested">
                                                <#list property?keys as name>
                                                    <#assign keyname = property[name]>
                                                    <li>
                                                        <div class="model-item">
                                                            <label for="${keyname}">
                                                                <input type="checkbox" class="ttlab-model-checkbox analysis-model-checkbox" id="ttlabscorer##${keyname}" />
                                                                ${name}
                                                            </label>
                                                        </div>
                                                    </li>
                                                </#list>
                                            </ol>
                                        </li>
                                    </#list>
                                </ul>
                            </li>
                        </#list>
                    </ul>
                </li>
                <li>
                    <div class="tree-toggle">
                        <i class="toggle-icon"></i>
                        <input type="checkbox" class="ttlab-group-checkbox analysis-group-checkbox" id="group_cohmetrix"/>
                        <label class="analysis-group-label" for="group_ttlab_scorer">Coh-Metrix (${cohMetrix?size})</label>
                    </div>
                    <ul class="nested">
                        <#list cohMetrix?keys as models>
                            <#assign cohgroups = cohMetrix[models]>
                            <li>
                                <#if models=="Text Easability Principal Component Scores">
                                    <div class="tree-toggle">
                                        <i class="toggle-icon"></i>
                                        <input type="checkbox" disabled class="ttlab-subgroup-checkbox analysis-group-checkbox" id="group_${models?index}" />
                                        <label style="color: gray;" class="analysis-group-label" for="group_${models?index}">${models} (${cohgroups?size})</label>
                                    </div>
                                <#else>
                                    <div class="tree-toggle">
                                        <i class="toggle-icon"></i>
                                        <input type="checkbox" class="ttlab-subgroup-checkbox analysis-group-checkbox" id="group_${models?index}" />
                                        <label class="analysis-group-label" for="group_${models?index}">${models}</label>
                                    </div>
                                </#if>
                                <ol class="nested">
                                    <#list cohgroups?keys as labels>
                                        <#assign label_i = cohgroups[labels]>
                                        <#assign label_name = label_i["label"]>
                                        <#assign description = label_i["description"]>
                                        <li>
                                            <div class="model-item">
                                                <#if models=="Text Easability Principal Component Scores">
                                                    <label for="${label_name}" style="color: gray;">
                                                        <input type="checkbox" disabled class="ttlab-model-checkbox analysis-model-checkbox" id="cohmetrix##${label_name}"/>
                                                        ${label_name} - ${description}
                                                    </label>
                                                <#else>
                                                    <label for="${label_name}">
                                                        <input type="checkbox" class="ttlab-model-checkbox analysis-model-checkbox" id="cohmetrix##${label_name}"/>
                                                        ${label_name} - ${description}
                                                    </label>
                                                </#if>

                                            </div>
                                        </li>
                                    </#list>
                                </ol>
                            </li>
                        </#list>
                    </ul>
                </li>
                <!-- Ende TTLAB Scorer -->
            </ul>
        </li>
    </ul>
</div>
