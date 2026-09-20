const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const target = process.argv[2]
const targets = {
  chrome: {
    manifest: 'manifest.json',
    artifacts: 'chrome',
  },
  firefox: {
    manifest: 'manifest_v2.json',
    artifacts: 'firefox',
  },
}

if (!targets[target]) {
  throw new Error('Usage: node scripts/build.js <chrome|firefox>')
}

const root = path.resolve(__dirname, '..')
const sourceDir = path.join(root, 'build')
const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nba-extension-'))
const artifactsDir = path.join(root, 'dist', targets[target].artifacts)

const generatedFiles = /\.(js|map|LICENSE\.txt)$/
const copyStaticFiles = () => {
  fs.cpSync(sourceDir, stagingDir, {
    recursive: true,
    filter: (file) => {
      const relative = path.relative(sourceDir, file)
      return relative === '' ||
        (!generatedFiles.test(relative) &&
          path.basename(file) !== 'manifest.json' &&
          path.basename(file) !== 'manifest_v2.json')
    },
  })
}

const ALLOWED_BINARIES = new Set([
  path.join(root, 'node_modules', '.bin', 'webpack'),
  path.join(root, 'node_modules', '.bin', 'web-ext'),
])

const run = (command, args) => {
  if (!ALLOWED_BINARIES.has(command)) {
    throw new Error(`Refusing to execute unapproved command: ${command}`)
  }

  const result = spawnSync(command, args, {
    cwd: root,
    env: {
      ...process.env,
      BUILD_DIR: stagingDir,
      BUILD_TARGET: target,
      BUILD_MANIFEST: targets[target].manifest,
      NODE_ENV: 'production',
    },
    stdio: 'inherit',
    shell: false,
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`)
  }
}

try {
  copyStaticFiles()
  run(path.join(root, 'node_modules', '.bin', 'webpack'), [
    '--config',
    'webpack.config.js',
  ])
  run(path.join(root, 'node_modules', '.bin', 'webpack'), [
    '--config',
    'bg.webpack.config.js',
  ])
  run(path.join(root, 'node_modules', '.bin', 'webpack'), [
    '--config',
    'popup.webpack.config.js',
  ])

  fs.mkdirSync(artifactsDir, { recursive: true })
  run(path.join(root, 'node_modules', '.bin', 'web-ext'), [
    'build',
    '--source-dir',
    stagingDir,
    '--artifacts-dir',
    artifactsDir,
    '--overwrite-dest',
    '--filename',
    `basketball-box-scores-${target}.zip`,
  ])
} finally {
  fs.rmSync(stagingDir, { recursive: true, force: true })
}
