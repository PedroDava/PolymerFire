/**
@license
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file or at
https://github.com/firebase/polymerfire/blob/master/LICENSE
*/
import '../polymerfire.js';

Polymer({
  _template: Polymer.html`
    <firebase-app auth-domain="polymerfire-test-6abc0.firebaseapp.com" database-url="https://polymerfire-test-6abc0.firebaseio.com" api-key="AIzaSyBxZI1BAgX9obocHQw_yhmHV9BIOpaNWZo" storage-bucket="polymerfire-test-6abc0.appspot.com">
    </firebase-app>

    <firebase-auth id="auth" user="{{user}}" provider="google" on-error="catchError">
    </firebase-auth>

    <button on-tap="signIn">Sign In</button> <br>

    <template is="dom-if" if="{{user}}">
      <firebase-storage-multiupload id="fs" path="/users/{{user.uid}}/files" files="[[files]]" upload-tasks="{{uploadedFiles}}" on-error="catchError" force-unique="" auto="">
      </firebase-storage-multiupload>

      <input id="file-uploader" type="file" on-change="onFileUpload" multiple=""> <br>

      <hr>

      <template is="dom-repeat" items="[[uploadedFiles]]">
        <div style="padding: 20px">
          <firebase-storage-upload-task task="[[item]]" id="task-[[index]]" bytes-transferred="{{item.bytesTransferred}}" total-bytes="{{item.totalBytes}}" state="{{item.state}}" download-url="{{item.downloadUrl}}" metadata="{{item.metadata}}" path="{{item.path}}">
          </firebase-storage-upload-task>

          path from snapshot: [[item.snapshot.ref.fullPath]] <br>
          path from upload-task: [[item.path]] <br>
          bytes transferred: [[item.bytesTransferred]] <br>
          storage uri: [[gsUri]] <br>
          state: [[item.state]] <br>
          metadata-contentType: [[item.metadata.contentType]] <br>

          <br>

          <template is="dom-if" if="[[!isEqual(item.state, 'success')]]">
            <paper-progress value="{{item.bytesTransferred}}" min="0" max="{{item.totalBytes}}">
            </paper-progress>
          </template>

          <br>

          <template is="dom-if" if="{{isEqual(item.state, 'success')}}">
            <firebase-storage-ref path="{{item.path}}" storage-uri="{{gsUri}}" id="ref-[[index]]" metadata="{{item.refMetadata}}" download-url="{{item.refDownloadUrl}}">
            </firebase-storage-ref>

            <a href="{{item.refDownloadUrl}}">{{item.refDownloadUrl}}</a> <br>

            <button on-tap="download" value="{{index}}">Download</button>

            <button on-tap="deleteFile" value="{{index}}">Delete</button>
          </template>

          <template is="dom-if" if="[[!isEqual(item.state, 'success')]]">
            <template is="dom-if" if="[[isEqual(item.state, 'running')]]">
              <button on-tap="cancel" value="{{index}}">Cancel</button>
              <button on-tap="pause" value="{{index}}">Pause</button>
            </template>

            <template is="dom-if" if="[[isEqual(item.state, 'paused')]]">
              <button on-tap="resume" value="{{index}}">Resume</button>
            </template>
          </template>

          <br>
        </div>
      </template>
    </template>

    <paper-toast id="toaster"></paper-toast>
`,

  is: 'firebase-storage-multiupload-auto',

  properties: {
    user: Object,

    files: {
      type: Array,
      notify: true,
      value: [],
    },

    uploadTasks: {
      type: Array,
      observer: '_uploadTasksChanged'
    },

    uploadedFiles: {
      type: Array,
    }
  },

  catchError(e) {
    this.$$('#toaster').show({
      text: e.detail.message
    });
  },

  cancel(e) {
    this.$$('#task-' + e.target.value).cancel();
  },

  resume(e) {
    this.$$('#task-' + e.target.value).resume();
  },

  pause(e) {
    this.$$('#task-' + e.target.value).pause();
  },

  download(e) {
    this.$$('#ref-' + e.target.value).getDownloadURL().then(function(d) {
      console.log(d)
      window.open(d, '_blank')
    })
  },

  deleteFile(e) {
    this.$$('#ref-' + e.target.value).delete().then(function(d) {
      console.log(d)
    })
  },

  _uploadTasksChanged(uploadTasks) {
    console.log(uploadTasks);
  },

  _uploadedFilesChanged(uploadedFiles) {
    console.log(uploadedFiles);
  },

  onFileUpload(e) {
    this.files = e.target.files;
    console.log(this.files)
  },

  isEqual(a, b) {
    return a === b;
  },

  signIn: function() {
    this.$.auth.signInAnonymously();
  }
});
