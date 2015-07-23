Documents = new FS.Collection("documents", {
    stores: [new FS.Store.GridFS("documents", {})],
    filter: {
        maxSize: 3145728, // 3145728 bytes = 3Mb
        //Certain file types crash server
        //Allow only files that have been tested
        //https://github.com/CollectionFS/Meteor-CollectionFS/issues/648
        allow: {
            contentTypes: [
                'image/jpeg',
                'image/bmp',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/pdf',
                'image/png',
                'text/plain',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/gif',
                'image/tiff',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ]
        },
        onInvalid: function (message) {
            if (Meteor.isClient) {
                alert(message);
            } else {
                console.log(message);
            }
        }
    }
});