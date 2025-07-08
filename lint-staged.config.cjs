module.exports = {
  '*.ts': ['npm run lint', 'npm run format'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
