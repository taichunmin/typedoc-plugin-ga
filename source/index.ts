import typedoc, { type Application } from 'typedoc';

function addGaOptionParameter(app: Application): void {
    app.options.addDeclaration({
        name: 'gaID',
        help: 'Set the Google Analytics tracking ID and activate tracking code',
        type: typedoc.ParameterType.String
    });
}

function addGaScript(app: Application): void {
    app.renderer.hooks.on('body.end', () => {
        const gaID = app.options.getValue('gaID') as string;
        if (gaID) {
            const script = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaID}');
`.trim();
            return typedoc.JSX.createElement(typedoc.JSX.Fragment, null, [
                typedoc.JSX.createElement('script', {
                    async: true,
                    src: `https://www.googletagmanager.com/gtag/js?id=${gaID}`
                }),
                typedoc.JSX.createElement('script', null, typedoc.JSX.createElement(typedoc.JSX.Raw, { html: script }))
            ]);
        }
        return typedoc.JSX.createElement(typedoc.JSX.Fragment, null);
    });
}

/**
 * This plugin adds Google Analytics tracking code to the generated documentation.
 *
 * @param app - The TypeDoc application.
 */
export function load(app: Application): void {
    addGaOptionParameter(app);
    addGaScript(app);
}
