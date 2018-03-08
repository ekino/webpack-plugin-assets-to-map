const AssetsToMap = require('./assetsToMap');

describe('AssetsToMap', () => {
    test('hello world', () => {
        const compiler = {};
        compiler.plugin = jest.fn();
        AssetsToMap.prototype.apply(compiler);
        expect(compiler.plugin).toHaveBeenCalled();
    });
});