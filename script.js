// 유료 모델 목록
const paidModels = [
    'openai/o3-mini',
    'openai/o4-mini',
    'openai/gpt-4.1',
    'openai/gpt-4.1-nano',
    'anthropic/claude-3.5-sonnet',
    'alibaba/qwen3-32b-instruct'
];

// 모델 정보 데이터
const modelInfo = {
    'deepseek/deepseek-prover-v2:free': {
        name: 'DeepSeek Prover V2',
        description: '수학 및 논리 추론이 특화된 모델로, 복잡한 프로그래밍 문제와 수학적 증명에 강점을 보입니다.',
        parameters: '비공개 파라미터',
        contextLength: '128K 토큰',
        features: ['수학 및 논리 추론 특화', '코딩 문제 해결', '긴 컨텍스트 지원'],
        paid: false
    },
    'meta-llama/llama-4-maverick:free': {
        name: 'Llama 4 Maverick',
        description: 'Meta의 최신 혼합 전문가 아키텍처를 사용한 모델로, 다양한 작업에 뛰어난 성능을 보입니다.',
        parameters: '400B 파라미터',
        contextLength: '256K 토큰',
        features: ['MoE 아키텍처', '긴 컨텍스트 지원', '텍스트 및 이미지 입력 지원'],
        paid: false
    },
    'anthropic/claude-3.5-sonnet': {
        name: 'Claude 3.5 Sonnet',
        description: 'Anthropic의 최신 모델로, 다양한 텍스트 생성 작업에 뛰어난 능력을 보입니다.',
        parameters: '70B 파라미터',
        contextLength: '200K 토큰',
        features: ['복잡한 추론', '코드 생성', '멀티턴 대화에 최적화'],
        paid: true
    }
};

// 예제 질문 목록
const exampleQueries = [
    "쿠버네티스의 주요 구성요소와 아키텍처를 설명해주세요.",
    "자바스크립트에서 비동기 프로그래밍의 개념과 Promise를 활용한 예제 코드를 보여주세요.",
    "머신러닝과 딥러닝의 차이점을 설명하고 대표적인 알고리즘을 소개해주세요.",
    "마이크로서비스 아키텍처의 장단점과 모놀리식 아키텍처와의 비교를 해주세요."
];

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 요소 참조
    const apiKeyInput = document.getElementById('apiKey');
    const modelSelect = document.getElementById('model');
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperatureValue');
    const queryTextarea = document.getElementById('query');
    const submitQueryButton = document.getElementById('submitQuery');
    const resetFormButton = document.getElementById('resetForm');
    const responseDiv = document.getElementById('response');
    const responseContent = document.getElementById('responseContent');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const copyResponseButton = document.getElementById('copyResponse');
    const toggleApiKeyButton = document.getElementById('toggleApiKey');
    const clearQueryButton = document.getElementById('clearQuery');
    const pasteExampleButton = document.getElementById('pasteExample');
    const copyCodeButton = document.getElementById('copyCode');
    const creditWarning = document.getElementById('creditWarning');
    const apiKeyFeedback = document.getElementById('apiKeyFeedback');
    const codeCopiedAlert = document.getElementById('codeCopiedAlert');
    const useModelButtons = document.querySelectorAll('.use-model-btn');

    // 모델 카드의 '이 모델 사용하기' 버튼 이벤트
    useModelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modelId = button.getAttribute('data-model');
            modelSelect.value = modelId;
            // 유료 모델 경고 표시
            if (paidModels.includes(modelId)) {
                creditWarning.classList.remove('hidden');
                creditWarning.classList.add('flex');
            } else {
                creditWarning.classList.add('hidden');
                creditWarning.classList.remove('flex');
            }
            // 폼으로 스크롤
            document.querySelector('.bg-gradient-to-r.from-indigo-600.to-blue-600').scrollIntoView({ behavior: 'smooth' });
            // 질문 입력란에 포커스
            setTimeout(() => queryTextarea.focus(), 500);
        });
    });

    // 모달 요소
    const apiKeyModal = document.getElementById('apiKeyModal');
    const closeModalButton = document.getElementById('closeModal');
    const confirmModalButton = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');

    // 창의성 슬라이더 이벤트
    temperatureSlider.addEventListener('input', () => {
        temperatureValue.textContent = temperatureSlider.value;
    });

    // API 키 표시/숨기기 버튼 이벤트
    toggleApiKeyButton.addEventListener('click', () => {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleApiKeyButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            apiKeyInput.type = 'password';
            toggleApiKeyButton.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });

    // 모델 선택 이벤트 (유료 모델 경고)
    modelSelect.addEventListener('change', () => {
        const selectedModel = modelSelect.value;
        if (paidModels.includes(selectedModel)) {
            creditWarning.classList.remove('hidden');
            creditWarning.classList.add('flex');
        } else {
            creditWarning.classList.add('hidden');
            creditWarning.classList.remove('flex');
        }
    });

    // 질문 초기화 버튼 이벤트
    clearQueryButton.addEventListener('click', () => {
        queryTextarea.value = '';
        queryTextarea.focus();
    });

    // 예제 질문 삽입 버튼 이벤트
    pasteExampleButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * exampleQueries.length);
        queryTextarea.value = exampleQueries[randomIndex];
        queryTextarea.focus();
    });

    // 코드 복사 버튼 이벤트
    copyCodeButton.addEventListener('click', () => {
        const sampleCode = document.getElementById('sampleCode').textContent;
        navigator.clipboard.writeText(sampleCode).then(() => {
            codeCopiedAlert.classList.remove('hidden');
            setTimeout(() => {
                codeCopiedAlert.classList.add('hidden');
            }, 2000);
        });
    });

    // 응답 복사 버튼 이벤트
    copyResponseButton.addEventListener('click', () => {
        const responseText = responseContent.textContent;
        navigator.clipboard.writeText(responseText).then(() => {
            // 복사 성공 알림
            const alertElement = document.createElement('div');
            alertElement.className = 'bg-green-500 text-white px-3 py-1 rounded-md text-sm absolute top-2 right-2';
            alertElement.textContent = '복사됨!';
            responseDiv.querySelector('.bg-gray-100').appendChild(alertElement);
            
            setTimeout(() => {
                alertElement.remove();
            }, 2000);
        });
    });

    // 폼 초기화 버튼 이벤트
    resetFormButton.addEventListener('click', () => {
        apiKeyInput.value = '';
        modelSelect.selectedIndex = 0;
        temperatureSlider.value = 0.7;
        temperatureValue.textContent = '0.7';
        queryTextarea.value = '';
        responseDiv.classList.add('hidden');
        creditWarning.classList.add('hidden');
        creditWarning.classList.remove('flex');
        apiKeyFeedback.classList.add('hidden');
    });

    // API 키 유효성 검증 함수
    function validateApiKey(apiKey) {
        const cleanedKey = apiKey.trim();
        const keyRegex = /^sk-or-v1-[a-zA-Z0-9]+$/;
        return keyRegex.test(cleanedKey) && cleanedKey.length > 20;
    }

    // 실시간 API 키 입력 검증
    apiKeyInput.addEventListener('input', () => {
        const apiKey = apiKeyInput.value;
        if (apiKey && !validateApiKey(apiKey)) {
            apiKeyFeedback.textContent = 'API 키 형식이 잘못되었습니다. 공백, 특수 문자, 한글을 제거하세요.';
            apiKeyFeedback.classList.remove('hidden');
        } else {
            apiKeyFeedback.classList.add('hidden');
        }
    });

    // 모달 닫기 이벤트
    closeModalButton.addEventListener('click', () => {
        apiKeyModal.classList.add('hidden');
    });

    confirmModalButton.addEventListener('click', () => {
        apiKeyModal.classList.add('hidden');
    });

    // 폼 제출 이벤트
    submitQueryButton.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value;
        const model = modelSelect.value;
        const temperature = parseFloat(temperatureSlider.value);
        const query = queryTextarea.value;

        // API 키 검증
        if (!apiKey) {
            modalMessage.textContent = 'OpenRouter API 키를 입력해 주세요. 단일 API 키로 모든 모델에 접근 가능합니다. API 키는 https://openrouter.ai/keys에서 생성할 수 있습니다.';
            apiKeyModal.classList.remove('hidden');
            return;
        }

        if (!validateApiKey(apiKey)) {
            modalMessage.textContent = 'API 키에 유효하지 않은 문자가 포함되었거나 형식이 잘못되었습니다. 공백, 특수 문자, 한글 등을 제거하고 https://openrouter.ai/keys에서 생성한 키를 확인하세요.';
            apiKeyModal.classList.remove('hidden');
            return;
        }

        // 질문 검증
        if (!query) {
            modalMessage.textContent = '질문을 입력해 주세요.';
            apiKeyModal.classList.remove('hidden');
            return;
        }

        // 로딩 표시
        loadingIndicator.classList.remove('hidden');
        submitQueryButton.disabled = true;
        submitQueryButton.classList.add('opacity-70');

        try {
            const headers = {
                'Authorization': `Bearer ${apiKey.trim()}`,
                'Content-Type': 'application/json'
            };

            const payload = {
                model: model,
                messages: [
                    { role: 'user', content: query }
                ],
                temperature: temperature
            };

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            // 로딩 숨기기
            loadingIndicator.classList.add('hidden');
            submitQueryButton.disabled = false;
            submitQueryButton.classList.remove('opacity-70');

            // 응답 처리
            responseDiv.classList.remove('hidden');
            
            if (data.choices && data.choices[0].message) {
                // 마크다운 변환을 위한 라이브러리 (예: marked.js)가 없으므로 간단한 형식 변환
                let content = data.choices[0].message.content;
                
                // 코드 블록 처리 (```code``` 형식)
                content = content.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-4">$1</pre>');
                
                // 단일 라인 코드 처리 (`code` 형식)
                content = content.replace(/`([^`]+)`/g, '<code class="bg-gray-100 p-1 rounded text-indigo-600">$1</code>');
                
                // 헤더 처리
                content = content.replace(/^### (.*$)/gm, '<h3 class="font-bold text-xl mt-4 mb-2">$1</h3>');
                content = content.replace(/^## (.*$)/gm, '<h2 class="font-bold text-2xl mt-6 mb-3">$1</h2>');
                content = content.replace(/^# (.*$)/gm, '<h1 class="font-bold text-3xl mt-8 mb-4">$1</h1>');
                
                // 리스트 처리 (단순화)
                content = content.replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
                content = content.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>');
                
                // 단락 처리
                content = content.replace(/\n\n/g, '</p><p class="mb-4">');
                
                // 최종 래핑
                content = `<p class="mb-4">${content}</p>`;
                
                // 응답 표시
                responseContent.innerHTML = content;
            } else if (data.error && data.error.code === 'insufficient_credits') {
                responseContent.innerHTML = '<div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500"><p class="text-red-700"><i class="fas fa-exclamation-circle mr-2"></i>오류: 계정에 크레딧이 부족합니다. <a href="https://openrouter.ai/settings/billing" class="text-blue-600 underline" target="_blank">OpenRouter</a>에서 크레딧을 충전하세요.</p></div>';
            } else if (data.error && data.error.code === 'invalid_api_key') {
                responseContent.innerHTML = '<div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500"><p class="text-red-700"><i class="fas fa-exclamation-circle mr-2"></i>오류: 유효하지 않은 API 키입니다. <a href="https://openrouter.ai/keys" class="text-blue-600 underline" target="_blank">OpenRouter</a>에서 새로운 키를 생성하세요.</p></div>';
            } else {
                responseContent.innerHTML = '<div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500"><p class="text-red-700"><i class="fas fa-exclamation-circle mr-2"></i>오류: API로부터 응답을 받지 못했습니다. API 키와 네트워크 상태를 확인하세요.</p></div>';
            }
        } catch (error) {
            // 로딩 숨기기
            loadingIndicator.classList.add('hidden');
            submitQueryButton.disabled = false;
            submitQueryButton.classList.remove('opacity-70');
            
            // 오류 표시
            responseDiv.classList.remove('hidden');
            responseContent.innerHTML = `<div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500"><p class="text-red-700"><i class="fas fa-exclamation-circle mr-2"></i>오류: ${error.message}. API 키에 공백이나 특수 문자가 포함되었는지 확인하세요.</p></div>`;
        }
    });

    // Escape 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !apiKeyModal.classList.contains('hidden')) {
            apiKeyModal.classList.add('hidden');
        }
    });
});
