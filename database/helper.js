
exports.printErrorMessage = function (errorFunc, funcParams, errorMessage) {
    console.log('[Func]   : ' + errorFunc);
    console.log('[Params] : ' + funcParams);
    console.log('[Error]  : ' + errorMessage);
    return;
};