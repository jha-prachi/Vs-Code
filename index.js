const $ = require('jquery');
require('jstree');
const nodePath = require('path');
const fs = require('fs');

$(document).ready(async function () {

    let editor = await createEditor();
    console.log(editor);

    let currPath = process.cwd();
    console.log(currPath);

    let data = [];
    let baseobj = {
        id: currPath,
        parent: '#',
        text: getNameFrompath(currPath)
    }

    let rootChildren = getCurrentDirectories(currPath);
    data = data.concat(rootChildren);

    data.push(baseobj);

    $('#jstree').jstree({
        "core": {
            // so that create works
            "check_callback": true,
            "data": data
        }
    }).on('open_node.jstree', function (e, data) {
        // console.log(data.node.children);

        data.node.children.forEach(function (child) {

            let childDirectories = getCurrentDirectories(child);
            console.log('child directories are ');
            console.log(childDirectories);

            for (let i = 0; i < childDirectories.length; i++) {
                let grandChild = childDirectories[i];
                $('#jstree').jstree().create_node(child, grandChild, "last");
            }

        })
    });

})

function getNameFrompath(path) {
    return nodePath.basename(path);
}

function getCurrentDirectories(path) {

    if (fs.lstatSync(path).isFile()) {
        return [];
    }

    let files = fs.readdirSync(path);
    // console.log(files);

    let rv = [];
    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        rv.push({
            id: nodePath.join(path, file),
            parent: path,
            text: file
        })
    }

    return rv;
}

function createEditor() {

    return new Promise(function (resolve, reject) {
        let monacoLoader = require('./node_modules/monaco-editor/min/vs/loader.js');

        monacoLoader.require.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });

        monacoLoader.require(['vs/editor/editor.main'], function () {
            var editor = monaco.editor.create(document.getElementById('editor'), {
                value: [
                    'function x() {',
                    '\tconsole.log("Hello world!");',
                    '}'
                ].join('\n'),
                language: 'javascript'
            });

            resolve(editor);
        });
    })

}
