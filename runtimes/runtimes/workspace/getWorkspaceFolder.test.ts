import assert from 'assert'
import { getWorkspaceFolder } from './getWorkspaceFolder'
const mockfs = require('mock-fs')

describe('getWorkspaceFolder', () => {
    beforeEach(async () => {
        mockfs({
            'workspaceroot1/src/project': {
                'some-file.txt': 'file content here',
                'empty-dir': {
                    /** empty directory */
                },
            },
            'workspaceroot2/myproject2/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
        })
    })

    afterEach(async () => {
        mockfs.restore()
    })

    it('should return folder for file', async () => {
        const workspaceFolders = [
            {
                uri: 'file:///workspaceroot1',
                name: 'testWorkspace1',
            },
            {
                uri: 'file:///workspaceroot2',
                name: 'testWorkspace2',
            },
        ]

        const folder = getWorkspaceFolder('file:///workspaceroot1/path/to/fake/dir/some-file.txt', workspaceFolders)

        assert.equal(folder, workspaceFolders[0])
    })

    it('should return null if file is not us known workspaceFolders', async () => {
        const workspaceFolders = [
            {
                uri: 'file:///workspaceroot1',
                name: 'testWorkspace1',
            },
            {
                uri: 'file:///workspaceroot2',
                name: 'testWorkspace2',
            },
        ]

        const folder = getWorkspaceFolder('file:///someotherdir/path/to/some-file.txt', workspaceFolders)

        assert.equal(folder, null)
    })

    it('should return undefined if folders not passed', async () => {
        const workspaceFolders = undefined

        const folder = getWorkspaceFolder('file:///someotherdir/path/to/some-file.txt', workspaceFolders)

        assert.equal(folder, undefined)
    })
})
