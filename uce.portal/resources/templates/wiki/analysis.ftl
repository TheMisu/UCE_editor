<div class="analysis-view">
    <!-- Header -->
    <header class="container-fluid card-shadow bg-lightgray">
                <h3 class="mb-0 mr-1 color-prime text-center">${languageResource.get("analysis")}</h3>
    </header>
</div>
<div class="mt-4">
    <div class="row m-0 p-0">
        <div class="col-3">
            <div class="resizable-container">
                <div class="analysis-sidebar-toggle">
                    <button class="analysis-toggle-btn" onclick="toggleSidebar('nlp-tools')" title="NLP-Tools">
                        <i class="fa fa-language" aria-hidden="true"></i>
                    </button>
                    <button class="analysis-toggle-btn" onclick="toggleSidebar('history')" title="History">
                        <i class="fa fa-folder-plus"></i>
                    </button>
                </div>
                <div class="analysis-main-content" id="analysis-main-content">
                    <div id="nlp-tools" class="analysis-sidebar-section draggable-section" draggable="true">
                        <div class="group-box card-shadow bg-light">
                            <h5 class="mb-0 mr-1 color-prime">NLP ${languageResource.get("models")}</h5>
                            <#include "/wiki/components/nlpModelTree.ftl">
                        </div>
                    </div>
                    <div id="history" class="analysis-sidebar-section draggable-section" draggable="true">
                        <div class="group-box card-shadow bg-light">
                            <h5 class="mb-0 mr-1 color-prime">${languageResource.get("history")}</h5>
                            <div id="analysis-result-history">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="group-box card-shadow bg-light">
                <h5 class="mb-0 mr-1 color-prime">${languageResource.get("inputField")}</h5>
                <div class="analysis-text-view">
                    <div class="grow-text">
                        <label for="analysis-input"></label><textarea name="analysis-input" id="analysis-input" rows="10" placeholder="${languageResource.get("input")}" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
                        <br />
                        <button type="button" class="btn-primary" id="analysis-upload-btn">${languageResource.get("upload")}</button>
                        <input type="file" id="file-input" accept=".txt" style="display: none;" />
                        <button class="btn btn-success run-pipeline-btn">
                            <i class="fas fa-play"></i> ${languageResource.get("RunPipeline")}
                        </button>
                    </div>
                </div>
            </div>
            <div id="claim-field-wrapper" style="display: none;">
                <div class="group-box card-shadow bg-light">
                    <h5 class="mb-0 mr-1 color-prime">Claim</h5>
                    <div class="analysis-text-view">
                        <div class="grow-text">
                            <textarea name="claim-text" id="claim-text" rows="10" placeholder="Claim" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div id="text-field-wrapper" style="display: none;">
                <div class="group-box card-shadow bg-light">
                    <h5 class="mb-0 mr-1 color-prime">Cohesion Text</h5>
                    <div class="analysis-text-view">
                        <div class="grow-text">
                            <textarea name="coherence-text" id="coherence-text" rows="10" placeholder="Text" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div id="stance-field-wrapper" style="display: none;">
                <div class="group-box card-shadow bg-light">
                    <h5 class="mb-0 mr-1 color-prime">Hypothesis</h5>
                    <div class="analysis-text-view">
                        <div class="grow-text">
                            <textarea name="stance-text" id="stance-text" rows="10" placeholder="Text" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div id="llm-field-wrapper" style="display: none;">
                <div class="group-box card-shadow bg-light">
                    <h5 class="mb-0 mr-1 color-prime">System Prompt</h5>
                    <div class="analysis-text-view">
                        <div class="grow-text">
                            <textarea name="llm-text" id="llm-text" rows="10" placeholder="Text" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div id="analysis-InputText-container"></div>
        </div>
        <div class="col-5">
            <div>
<#--                <h5 class="mb-0 mr-1 color-prime">${languageResource.get("output")}</h5>-->
                <div id="analysis-result-container">
                </div>
            </div>
        </div>
    </div>
</div>

