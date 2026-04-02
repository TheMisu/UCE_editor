<div class="container">

    <!-- uce corporate data -->
    <div class="mt-5 uce-description">
        <div class="flexed align-items-center justify-content-between">
            <h5 class="color-prime mb-0 clickable" onclick="$(this).parent().next('.content').toggle(50)">${uceConfig.getMeta().getName()?trim!"-"}</h5>
            <button class="btn" onclick="$(this).parent().next('.content').toggle(50)">
                <i class="fas fa-info-circle color-prime large-font"></i>
            </button>
        </div>
        <div class="content display-none text block-text">
            <hr class="mt-3 mb-3"/>
            ${uceConfig.getMeta().getDescription()!languageResource.get("noCorpusDescription")}
        </div>
    </div>

    <div class="corpora-list">
        <div class="flexed align-items-center justify-content-between">
            <h3 class="font-weight-bold text-dark mb-0"><i
                        class="color-prime fas fa-database mr-2"></i> ${languageResource.get("corpora")}</h3>
            <button id="word-upload-btn" class="btn btn-primary btn-sm">
                <i class="fas fa-file-word mr-1"></i> Upload Document
            </button>
        </div>
        <div class="row m-0 p-0 ">
            <#if corpora?size == 0>
                <div class="group-box mt-2 bg-ghost">
                    <p class="mb-0 text-center w-100 text">${languageResource.get("noCorpora")}</p>
                </div>
            </#if>
            <#list corpora as corpusVm>
                <div class="col-md-12 m-0 p-3">
                    <div class="corpus-card">
                        <!-- header -->
                        <div class="flexed align-items-center justify-content-between">
                            <div>
                                <h5 class="justify-content-start open-corpus-inspector-btn border-0 w-100 mb-2 color-prime clickable"
                                    data-id="${corpusVm.getCorpus().getId()}">
                                    <i class="fas fa-globe mr-2"></i> ${corpusVm.getCorpus().getName()?trim}
                                </h5>
                                <p class="text mb-0 small"><i class="fas fa-pen-nib mr-1"></i> ${corpusVm.getCorpus().getAuthor()}</p>
                            </div>
                            <div>
                                <a class="btn open-corpus-inspector-btn mb-1" data-trigger="hover"
                                   data-toggle="popover" data-placement="top" data-id="${corpusVm.getCorpus().getId()}"
                                   data-content="${languageResource.get("openCorpus")}">
                                    <i class="fas fa-globe color-prime"></i>
                                </a>
                                <a class="btn light-border flexed clickable align-items-center pl-1 pr-1 mt-1 justify-content-center"
                                   data-trigger="hover"
                                   onclick="$(this).closest('.corpus-card').find('.expanded-content').toggle(75)">
                                    <i class="fas fa-info-circle color-prime"></i>
                                </a>
                            </div>

                        </div>

                        <div class="expanded-content">
                            <hr class="mt-3 mb-1 "/>

                            <!-- content -->
                            <div class="corpus-description small mb-0 p-3">
                                <#if corpusVm.getCorpusConfig().getDescription()?has_content>
                                    ${corpusVm.getCorpusConfig().getDescription()}
                                <#else>
                                    ${languageResource.get("noCorpusDescription")}
                                </#if>
                            </div>
                        </div>
                    </div>
                </div>
            </#list>
        </div>

        <!-- clal to search -->
        <div class="flexed align-items-center justify-content-center mt-3 pb-4">
            <a class="clickable text mb-0 text small ml-1" onclick="navigateToView('search')">
                <i class="fas fa-search mr-1"></i> ${languageResource.get("callForSearch")}
            </a>
        </div>
    </div>

</div>

<div id="word-upload-success" class="alert alert-success display-none small" style="position:fixed;bottom:20px;right:20px;z-index:9999;min-width:300px;"></div>

<!-- word document upload modal -->
<div id="word-upload-modal" class="display-none" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;">
    <div class="group-box bg-light" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:420px;max-width:95vw;">
        <div class="flexed align-items-center justify-content-between mb-3">
            <h5 class="mb-0 color-prime"><i class="fas fa-file-word mr-2"></i> Upload Word Document</h5>
            <a class="w-rounded-btn" onclick="$('#word-upload-modal').hide()"><i class="fas fa-times"></i></a>
        </div>
        <div class="form-group">
            <label class="text small">Corpus</label>
            <select id="word-corpus-select" class="form-control">
                <#list corpora as corpusVm>
                    <option value="${corpusVm.getCorpus().getId()}">${corpusVm.getCorpus().getName()?trim}</option>
                </#list>
            </select>
        </div>
        <div class="form-group">
            <label class="text small">File (.docx)</label>
            <input type="file" id="word-upload-input" class="form-control-file" accept=".docx"/>
        </div>
        <div id="word-upload-error" class="alert alert-danger display-none small mt-2 mb-2"></div>
        <div id="word-upload-steps" class="display-none mt-3 mb-1">
            <div id="word-step-extract" class="text small mb-1"><i class="fas fa-circle-notch fa-spin mr-2"></i> Extracting text from document...</div>
            <div id="word-step-create"  class="text small mb-1 display-none"><i class="fas fa-circle-notch fa-spin mr-2"></i> Saving document...</div>
            <div id="word-step-analyze" class="text small mb-1 display-none"><i class="fas fa-circle-notch fa-spin mr-2"></i> Running NLP analysis (this may take a while)...</div>
        </div>
        <div class="flexed align-items-center justify-content-end mt-3">
            <button id="word-upload-submit" class="btn btn-primary btn-sm">
                <i class="fas fa-upload mr-1"></i> Upload &amp; Analyze
            </button>
        </div>
    </div>
</div>