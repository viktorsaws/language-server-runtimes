import assert from 'assert'
const mockfs = require('mock-fs')
import { findFiles } from './findFiles'
import path from 'path'

describe('findFiles', () => {
    beforeEach(async () => {
        mockfs({
            workspaceroot1: {
                src: {
                    'some-file.ts': 'file content here',
                    'some-other-file.ts': 'file content here',
                    'empty-dir': {
                        /** empty directory */
                    },
                    nestedDir: {
                        'nestedFile.ts': 'nested file content',
                        'nestedFile.test.ts': 'nested file content',
                    },
                },
                tests: {
                    'some-test-file.test.ts': 'test file content',
                },
                'index.ts': 'index file',
            },
            workspaceroot2: {
                myproject2: {
                    'test.ts': 'file content',
                    nestedDir: {
                        'nestedFile.ts': 'nested file content',
                        'nestedFile.test.ts': 'nested file content',
                    },
                },
            },
            'index.ts': 'root file',
        })
    })

    afterEach(async () => {
        mockfs.restore()
    })

    it('returns list of files with glob pattern prefixed with folder path', async () => {
        // const files = await findFiles(`${(new URL(folder!.uri)).pathname}**/*.ts`)
        const files = await findFiles(`workspaceroot1/**/*.ts`)

        assert.deepStrictEqual(files, [
            'file:///workspaceroot1/index.ts',
            'file:///workspaceroot1/tests/some-test-file.test.ts',
            'file:///workspaceroot1/src/some-other-file.ts',
            'file:///workspaceroot1/src/some-file.ts',
            'file:///workspaceroot1/src/nestedDir/nestedFile.ts',
            'file:///workspaceroot1/src/nestedDir/nestedFile.test.ts',
        ])

        const testFiles = await findFiles(`workspaceroot1/**/*.test.ts`)

        assert.deepStrictEqual(testFiles, [
            'file:///workspaceroot1/tests/some-test-file.test.ts',
            'file:///workspaceroot1/src/nestedDir/nestedFile.test.ts',
        ])
    })

    it('returns list of files with glob pattern in all known folders', async () => {
        console.log('PATH::', path.resolve(path.join(__dirname, 'sampleWs')))
        const files = await findFiles('**/*.ts')

        assert.deepStrictEqual(files, [
            'file:///index.ts',
            'file:///workspaceroot1/index.ts',
            'file:///workspaceroot2/myproject2/test.ts',
            'file:///workspaceroot1/tests/some-test-file.test.ts',
            'file:///workspaceroot1/src/some-other-file.ts',
            'file:///workspaceroot1/src/some-file.ts',
            'file:///workspaceroot2/myproject2/nestedDir/nestedFile.ts',
            'file:///workspaceroot2/myproject2/nestedDir/nestedFile.test.ts',
            'file:///workspaceroot1/src/nestedDir/nestedFile.ts',
            'file:///workspaceroot1/src/nestedDir/nestedFile.test.ts',
        ])
    })
})
