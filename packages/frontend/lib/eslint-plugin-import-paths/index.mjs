import path from 'node:path';

function getAbsolutePath(filePath, context, rootDir) {
  const absoluteSourceFilePath = context.filename;
  const absoluteImportFilePath = path.join(path.dirname(absoluteSourceFilePath), filePath);
  const absoluteRootDir = path.join(context.cwd, rootDir);

  return path.relative(absoluteRootDir, absoluteImportFilePath).split(path.sep).join('/');
}

function getRelativePath(filePath, context, rootDir) {
  const absoluteSourceFilePath = context.filename;
  const absoluteRootDir = path.join(context.cwd, rootDir);
  const absoluteImportFilePath = path.join(absoluteRootDir, filePath);

  let relativePath = path.relative(path.dirname(absoluteSourceFilePath), absoluteImportFilePath);
  if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`;
  return relativePath.split(path.sep).join('/');
}

function getSecondSegment(pathname) {
  return pathname.split(path.sep).filter((s) => !s.startsWith('_'))[1];
}

function shouldTransformRelative(filePath, context, rootDir, rootPaths) {
  if (!filePath.startsWith('../')) return false;

  const absoluteRootPaths = rootPaths.map((rootPath) => path.join(context.cwd, rootDir, rootPath));
  const absoluteSourceFilePath = context.filename;
  const absoluteImportFilePath = path.join(path.dirname(absoluteSourceFilePath), filePath);
  const absoluteRootDir = path.join(context.cwd, rootDir);

  const sourceFileSecondSegment = getSecondSegment(path.relative(absoluteRootDir, absoluteSourceFilePath));
  const importFilePathSecondSegment = getSecondSegment(path.relative(absoluteRootDir, absoluteImportFilePath));

  if (sourceFileSecondSegment === importFilePathSecondSegment) return false;
  return absoluteRootPaths.some((absoluteRootPath) => absoluteImportFilePath.startsWith(absoluteRootPath));
}

function shouldTransformAbsolute(filePath, context, rootDir, rootPaths) {
  const root = filePath.split('/')[0];
  if (!rootPaths.includes(root)) return false;

  const absoluteRootDir = path.join(context.cwd, rootDir);
  const absoluteSourceFilePath = path.relative(absoluteRootDir, context.filename);

  return getSecondSegment(absoluteSourceFilePath) === getSecondSegment(filePath.split('/').join(path.sep));
}

export default {
  rules: {
    'import-paths': {
      meta: {
        type: 'layout',
        fixable: 'code',
        schema: [
          {
            type: 'object',
            properties: {
              rootPaths: { type: 'array', items: { type: 'string' } }
            }
          }
        ]
      },

      create: function (context) {
        const rootPaths = context.options[0]?.rootPaths || [];
        const rootDir = path.relative(context.cwd, context.filename.replace(/src.+/, 'src'));

        return {
          ImportDeclaration: function (node) {
            const filePath = node.source.value;
            if (shouldTransformRelative(filePath, context, rootDir, rootPaths)) {
              context.report({
                node,
                message: 'This import statement should have an absolute path',
                fix: function (fixer) {
                  return fixer.replaceTextRange(
                    [node.source.range[0] + 1, node.source.range[1] - 1],
                    getAbsolutePath(filePath, context, rootDir)
                  );
                }
              });
            } else if (shouldTransformAbsolute(filePath, context, rootDir, rootPaths)) {
              context.report({
                node,
                message: 'This import statement should have a relative path',
                fix: function (fixer) {
                  return fixer.replaceTextRange(
                    [node.source.range[0] + 1, node.source.range[1] - 1],
                    getRelativePath(filePath, context, rootDir)
                  );
                }
              });
            }
          }
        };
      }
    }
  }
};
