#Create package of core library
.\nuget.exe pack ..\Solution\Localization.Core\Localization.Core.csproj -IncludeReferencedProjects

#Create package of web library
Remove-Item ..\Solution\Localization.Web\Localization.Core.Container.config
.\nuget.exe pack ..\Solution\Localization.Web\Localization.Web.csproj -IncludeReferencedProjects