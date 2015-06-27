Documents = new FS.Collection("documents", {
    stores: [new FS.Store.GridFS("documents", {})]
});