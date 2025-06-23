using CaptchaMvc.Infrastructure;
using CaptchaMvc.Interface;
using CaptchaMvc.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace PlanDigitization_web
{
	public class MvcApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
			CaptchaUtils.CaptchaManager.StorageProvider = new CookieStorageProvider();
			////--Captcha--
			//var captchaManager = (DefaultCaptchaManager)CaptchaUtils.CaptchaManager;       
			////-- this will generate  alphanumeric string------------------
			//captchaManager.CharactersFactory = () => "123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz";         
			//captchaManager.PlainCaptchaPairFactory = length =>        
			//{            
			//	string randomText = RandomText.Generate(captchaManager.CharactersFactory(), length);            
			//	bool ignoreCase = false;//This parameter is responsible for ignoring case.
			//	return new KeyValuePair<string, ICaptchaValue>(Guid.NewGuid().ToString("N"),                
			//			new StringCaptchaValue(randomText, randomText, ignoreCase));        
			//};
		}


		protected void Application_End()
		{
			//Pass the custom Session ID to the browser.
			//if (Response.Cookies["ASP.NET_SessionId"] != null)
			//{
			//    Response.Cookies["ASP.NET_SessionId"].Value = Request.Cookies["ASP.NET_SessionId"].Value + GenerateHashKey();
			//}
			//Pass the custom Session ID to the browser.
			if (Session["ASP.NET_SessionId"] != null)
			{
				Session["ASP.NET_SessionId"] = Request.Cookies["ASP.NET_SessionId"].Value + GenerateHashKey();
			}
		}


		private string GenerateHashKey()
		{
			StringBuilder myStr = new StringBuilder();
			myStr.Append(Request.Browser.Browser);
			myStr.Append(Request.Browser.Platform);
			myStr.Append(Request.Browser.MajorVersion);
			myStr.Append(Request.Browser.MinorVersion);
			//myStr.Append(Request.LogonUserIdentity.User.Value);
			SHA1 sha = new SHA1CryptoServiceProvider();
			byte[] hashdata = sha.ComputeHash(Encoding.UTF8.GetBytes(myStr.ToString()));
			return Convert.ToBase64String(hashdata);
		}



		protected void Application_PreSendRequestHeaders()
		{

			HttpContext.Current.Response.Headers.Remove("X-Powered-By");
			HttpContext.Current.Response.Headers.Remove("X-AspNet-Version");
			HttpContext.Current.Response.Headers.Remove("X-AspNetMvc-Version");
			HttpContext.Current.Response.Headers.Remove("Server");
		}
		protected void Session_Start(Object sender, EventArgs e)
		{
			// secure the ASP.NET Session ID only if using SSL
			// if you don't check for the issecureconnection, it will not work.
			if (Request.IsSecureConnection == true)
				Response.Cookies["ASP.NET_SessionID"].Secure = true;

		}


		protected void Application_AcquireRequestState(object sender, EventArgs e)
		{
			string _sessionIPAddress = string.Empty;
			string _sessionBrowserInfo = string.Empty;
			string _sessionGuidInfo = string.Empty;
			//string _sessionBrowserInfo = string.Empty;
			if (HttpContext.Current.Session != null)
			{
				string _encryptedString = Convert.ToString(Session["encryptedSession"]);
				byte[] _encodedAsBytes = System.Convert.FromBase64String(_encryptedString);
				string _decryptedString = System.Text.ASCIIEncoding.ASCII.GetString(_encodedAsBytes);

				char[] _separator = new char[] { '^' };
				if (_decryptedString != string.Empty && _decryptedString != "" && _decryptedString != null)
				{
					string[] _splitStrings = _decryptedString.Split(_separator);
					if (_splitStrings.Count() > 0)
					{
						//string UserId = _splitStrings[0];
						//string Ticks = _splitStrings[1];
						string dummyGuid = _splitStrings[3];

						if (_splitStrings[2].Count() > 0)
						{
							string[] _userBrowserInfo = _splitStrings[2].Split('~');
							if (_userBrowserInfo.Count() > 0)
							{
								_sessionBrowserInfo = _userBrowserInfo[0];
								_sessionIPAddress = _userBrowserInfo[1];
							}
						}
						if (_splitStrings[3].Count() > 0)
						{
							string[] _userGuidInfo = _splitStrings[3].Split('~');
							if (_userGuidInfo.Count() > 0)
							{
								_sessionGuidInfo = _userGuidInfo[0];

							}
						}
					}
				}

				string _currentUseripAddress;
				string _currentUserbrowserinfo;
				string _currentUserGuidinfo;
				if (string.IsNullOrEmpty(Request.ServerVariables["HTTP_X_FORWARDED_FOR"]))
				{
					_currentUseripAddress = Request.ServerVariables["REMOTE_ADDR"];
					_currentUserbrowserinfo = Request.Browser.Browser
																+ Request.Browser.Version
																+ Request.UserAgent + "~"
																 + Request.ServerVariables["REMOTE_ADDR"];


				}
				else
				{
					_currentUseripAddress =
					Request.ServerVariables["HTTP_X_FORWARDED_FOR"].Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
				}

				System.Net.IPAddress result;
				if (!System.Net.IPAddress.TryParse(_currentUseripAddress, out result))
				{
					result = System.Net.IPAddress.None;
				}

				if (_sessionIPAddress != "" && _sessionIPAddress != string.Empty)
				{
					//Same way we can validate browser info also...
					string _currentBrowserInfo = Request.Browser.Browser + Request.Browser.Version + Request.UserAgent;
					if (_sessionIPAddress != _currentUseripAddress && _sessionBrowserInfo != _currentBrowserInfo)
					{
						Session.RemoveAll();
						Session.Clear();
						Session.Abandon();
						Response.Cookies["ASP.NET_SessionId"].Expires = DateTime.Now.AddSeconds(-30);
						Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
						Response.RedirectToRoute("Default");
						//HttpContext.Current.RewritePath("Main/Login");
					}
					else
					{
						//Valid User
					}
				}
			}
		}
	}
}
