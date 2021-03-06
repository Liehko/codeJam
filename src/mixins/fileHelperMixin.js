import { Platform } from 'quasar'

export const fileHelperMixin = {
  methods: {
    readFile (filePath) {
      if (Platform.is.mobile) {
        console.log('log1')
        var _this = this
        return new Promise(function (resolve, reject) {
          // eslint-disable-next-line no-undef
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fs => {
            fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
              _this.readFileFromFE(fileEntry)
                .then(data => {
                  resolve(data)
                }, err => {
                  reject(err)
                })
            })
          })
        })
      } else if (Platform.is.electron) {
        return new Promise(function (resolve, reject) {
          try {
            // %TODO% make a global import
            const fs = require('fs')
            fs.readFile(filePath, 'utf-8', (error, data) => {
              if (error) {
                reject(error)
              } else {
                resolve(data)
              }
            })
          } catch (error) {
            console.log('Failed to load module "fs"', error)
            throw error
          }
        })
      }
    },
    readFileFromFE (fileEntry) {
      return new Promise(function (resolve, reject) {
        fileEntry.file(function (file) {
          var reader = new FileReader()

          reader.onloadend = function () {
            console.log('read:Successful file read ' + fileEntry.fullPath + ': ' + this.result)
            resolve(this.result)
          }
          reader.onerror = function (event) {
            reject('read: error  reading the file')
          }
          reader.readAsText(file)
        })
      })
    },
    writeFile (filePath, data) {
      if (Platform.is.mobile) {
        var _this = this
        return new Promise(function (resolve, reject) {
          // eslint-disable-next-line no-undef
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            console.log('write:file system open: ' + fs.name)
            fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
              console.log('write:fileEntry is file?' + fileEntry.isFile.toString())
              _this.writeFileFromFE(fileEntry, data)
                .then(() => {
                  resolve()
                })
            })
          })
        })
      } else if (Platform.is.electron) {
        return new Promise(function (resolve, reject) {
          try {
            const fs = require('fs')
            fs.writeFile(filePath, data, 'utf-8', (error, data2) => {
              if (error) {
                reject(error)
              } else {
                resolve(data2)
              }
            })
          } catch (error) {
            console.log('Failed to load module "fs"', error)
            throw error
          }
        })
      }
    },
    writeFileFromFE (fileEntry, jsObject) {
      return new Promise(function (resolve, reject) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.onwriteend = function () {
            console.log('write:Successful file write...')
            // fsHelpers.readFile(fileEntry)
            resolve()
          }

          fileWriter.onerror = function (e) {
            console.log('write:Failed file write: ' + e.toString())
          }

          // If data object is not passed in,
          // create a new Blob instead.
          var dataObj = new Blob([JSON.stringify(jsObject, null, 4)], { type: 'application/json' })

          fileWriter.write(dataObj)
        })
      })
    }
  }
}
