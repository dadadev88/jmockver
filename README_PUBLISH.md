# How to publish a RC new version

### If is a new feature, bug fix or other changes:
1. Create a new `feature/bugfix/other` branch from `develop`, add changes and after test all is working.
2. Set a new STABLE semantic version in the `package.json` file, without the `-rc` suffix.
3. Run the `npm run version-rc` script to create a new RC version, this will set the version with suffix '-rc.0'.
   - Example: `1.0.0 -> 1.0.0-rc.0`, `1.1.0 -> 1.1.0-rc.0`, `1.0.1 -> 1.0.1-rc.0`
4. Create a Pull Request from `feature/bugfix/other` branch to the `develop`
5. Merge the Pull Request to the `develop` branch
   - When Pull Request is merged, a workflow will be triggered to publish the RC version to npm.

### If only want update a RC version:
This is useful when existing RC version has some issues and need to update it.
1. Run the `npm run version-rc` script to create a new RC version, this will increment with suffix '-rc.1, -rc.2, -rc.3, ...'.
   - Example: `1.0.0-rc.0 -> 1.0.0-rc.1`, `1.1.0-rc.2 -> 1.1.0-rc.3`, `1.0.1-rc.10 -> 1.0.1-rc.11`
2. Create a Pull Request from `feature/bugfix/other` branch to the `develop` branch
3. Merge the Pull Request to the `develop` branch
   - When Pull Request is merged, a workflow will be triggered to publish the RC version to npm.

# How to publish a STABLE version

1. Create Pull Request from `develop` to `master`
2. Merge the Pull Request to the `master` branch
 - When Pull Request is merged, a workflow will be triggered to publish the STABLE version to npm.
 - This workflow will also create and push a new tag to the repository.

# How to publish a STABLE version

1. Create Pull Request from `develop` to `master`
2. Merge the Pull Request to the `master` branch
3. When Pull Request is merged, a workflow will be triggered to publish the STABLE version to npm.
