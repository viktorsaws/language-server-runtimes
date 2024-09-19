import { glob } from 'glob'
import { CancellationToken } from '../../server-interface'
import { URI } from 'vscode-uri'

// TODO: verify Windows support of paths
export const findFiles = async (include: string, token?: CancellationToken) => {
    const abortController = new AbortController()

    // Abort when request is cancelled
    if (token) {
        token.onCancellationRequested(() => {
            abortController.abort('Cancelled')
        })
    }

    // Abort after 2 seconds
    setTimeout(() => {
        abortController.abort('Timeout')
    }, 2000)

    const result = await glob(include, {
        // cwd: // Defaults to process.cwd() if not set. Globs like `**/smth` will result in traversing filetree in LS process CWD. Ideally we should limit scope to registered workspaceFoldesr only.
        signal: abortController.signal,
        nodir: true,
        // Can we limit search?
    })

    return result.map(f => URI.file(f).toString())
}
