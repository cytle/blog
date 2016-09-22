#! /bin/bash
# publish to github

hexo g
cd ./public
git add -A .
git commit -m 'new generate'
git push origin master
cd ..

