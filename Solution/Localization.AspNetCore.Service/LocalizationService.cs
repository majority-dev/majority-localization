﻿using System;
using System.Globalization;
using Localization.CoreLibrary.Manager;
using Localization.CoreLibrary.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Localization;

namespace Localization.AspNetCore.Service
{
    public sealed class LocalizationService : ServiceBase, ILocalization
    {
        private readonly IAutoLocalizationManager m_localizationManager;

        public LocalizationService(
            IHttpContextAccessor httpContextAccessor,
            IAutoLocalizationManager autoLocalizationManager
        )
            : base(httpContextAccessor)
        {
            m_localizationManager = autoLocalizationManager;
        }

        // TODO there are almost duplicate definitions of this method (LocalizationService, DynamicText, DictionaryService, DatabaseDictionaryManager)
        public CultureInfo GetRequestCulture()
        {
            var request = HttpContextAccessor.HttpContext.Request;

            var cultureCookie = request.Cookies[CultureCookieName] ?? m_localizationManager.DefaultCulture().Name;

            return new CultureInfo(cultureCookie);
        }

        //Explicit calls
        public CultureInfo[] SupportedCultures()
        {
            return m_localizationManager.SupportedCultures();
        }

        public void SetCulture(string culture)
        {
            var requestCulture = new RequestCulture(culture);
            var response = HttpContextAccessor.HttpContext.Response;
            response.Cookies.Append(
                CultureCookieName,
                requestCulture.Culture.Name,
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddYears(1)
                }
            );
        }

        public LocalizedString Translate(string text, string scope, LocTranslationSource translationSource)
        {
            var requestCulture = GetRequestCulture();

            return m_localizationManager.Translate(translationSource, text, requestCulture, scope);
        }

        public LocalizedString TranslateFormat(string text, object[] parameters, string scope, LocTranslationSource translationSource)
        {
            var requestCulture = GetRequestCulture();

            return m_localizationManager.TranslateFormat(translationSource, text, parameters, requestCulture, scope);
        }

        public LocalizedString TranslatePluralization(string text, int number, string scope, LocTranslationSource translationSource)
        {
            var requestCulture = GetRequestCulture();

            return m_localizationManager.TranslatePluralization(translationSource, text, number, requestCulture, scope);
        }

        public LocalizedString TranslateConstant(string text, string scope, LocTranslationSource translationSource)
        {
            var requestCulture = GetRequestCulture();

            return m_localizationManager.TranslateConstant(translationSource, text, requestCulture, scope);
        }

        //Explicit calls and translationSource = LocTranslationSource.Auto
        public LocalizedString Translate(string text, string scope)
        {
            return Translate(text, scope, LocTranslationSource.Auto);
        }

        public LocalizedString TranslateFormat(string text, object[] parameters, string scope)
        {
            return TranslateFormat(text, parameters, scope, LocTranslationSource.Auto);
        }

        public LocalizedString TranslatePluralization(string text, int number,
            string scope)
        {
            return TranslatePluralization(text, number, scope, LocTranslationSource.Auto);
        }

        public LocalizedString TranslateConstant(string text, string scope)
        {
            return TranslateConstant(text, scope, LocTranslationSource.Auto);
        }


        //Without scope
        public LocalizedString Translate(string text, LocTranslationSource translationSource)
        {
            return Translate(text, null, translationSource);
        }

        public LocalizedString TranslateFormat(string text, object[] parameters, LocTranslationSource translationSource)
        {
            return TranslateFormat(text, parameters, null, translationSource);
        }

        public LocalizedString TranslatePluralization(string text, int number,
            LocTranslationSource translationSource)
        {
            return TranslatePluralization(text, number, null, translationSource);
        }

        public LocalizedString TranslateConstant(string text, LocTranslationSource translationSource)
        {
            return TranslateConstant(text, null, translationSource);
        }

        //Without scope and translationSource = LocTranslationSource.Auto
        public LocalizedString Translate(string text)
        {
            return Translate(text, null, LocTranslationSource.Auto);
        }

        public LocalizedString TranslateFormat(string text, object[] parameters)
        {
            return TranslateFormat(text, parameters, null, LocTranslationSource.Auto);
        }

        public LocalizedString TranslatePluralization(string text, int number)
        {
            return TranslatePluralization(text, number, null, LocTranslationSource.Auto);
        }

        public LocalizedString TranslateConstant(string text)
        {
            return TranslateConstant(text, null, LocTranslationSource.Auto);
        }
    }
}