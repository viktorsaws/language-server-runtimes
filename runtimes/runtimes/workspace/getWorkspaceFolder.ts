import { WorkspaceFolder } from '../../protocol'

export const getWorkspaceFolder = (
    uri: string,
    folders?: WorkspaceFolder[] | null
): WorkspaceFolder | null | undefined => {
    const fileUrl = new URL(uri)
    const normalizedFileUri = fileUrl.pathname || ''

    if (!folders) return undefined

    for (const folder of folders) {
        const folderUrl = new URL(folder.uri)
        const normalizedFolderUri = folderUrl.pathname || ''
        if (normalizedFileUri.startsWith(normalizedFolderUri)) {
            return folder
        }
    }

    return null
}
