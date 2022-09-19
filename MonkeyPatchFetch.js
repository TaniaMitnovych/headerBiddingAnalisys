const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
    let [resource, config ] = args;
    config.method="POST";
    config.body=resource;
    resource = 'http://127.0.0.1:3000/';
    config.mode="no-cors";
    const response = await originalFetch(resource, config);

    return response;
};