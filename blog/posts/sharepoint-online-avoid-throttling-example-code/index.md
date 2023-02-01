---
title: SharePoint Online Avoid Throttling Example Code
date: "2023-01-31"
description: "A few example code snippets of avoiding throttling in SharePoint Online"
tags: ['sharepoint-online']
---

## Overview

A few example code snippets of avoiding throttling in SharePoint Online

## Example of decorating traffic with User agent when using Client Side Object Model (CSOM)

```c
// Get access to source site
using (var ctx = new ClientContext("https://contoso.sharepoint.com/sites/team"))
{
  //Provide account and pwd for connecting to SharePoint Online
  var passWord = new SecureString();
  foreach (char c in pwd.ToCharArray()) passWord.AppendChar(c);
  ctx.Credentials = new SharePointOnlineCredentials("contoso@contoso.onmicrosoft.com", passWord);

  // Add our User Agent information
  ctx.ExecutingWebRequest += delegate (object sender, WebRequestEventArgs e)
  {
      e.WebRequestExecutor.WebRequest.UserAgent = "NONISV|Contoso|GovernanceCheck/1.0";
  };

  // Normal CSOM Call with custom User-Agent information
  Web site = ctx.Web;
  ctx.Load(site);
  ctx.ExecuteQuery();
}
```

Following sample is in C# format, but the similar User Agent information is recommended to be used even for the JavaScript libraries used in the SharePoint Online pages.

## Example of decorating traffic with User agent when using REST APIs

```c
HttpWebRequest endpointRequest = (HttpWebRequest) HttpWebRequest.Create(sharepointUrl.ToString() + "/_api/web/lists");
endpointRequest.Method = "GET";
endpointRequest.UserAgent = "NONISV|Contoso|GovernanceCheck/1.0";
endpointRequest.Accept = "application/json;odata=nometadata";
endpointRequest.Headers.Add("Authorization", "Bearer " + accessToken);
HttpWebResponse endpointResponse = (HttpWebResponse)endpointRequest.GetResponse();
```

## CSOM Code sample: ExecuteQueryWithIncrementalRetry extension method

> You'll need to use SharePoint Online CSOM version 16.1.8316.1200 (December 2018 version) or higher.

Add this extension method in a static class and use `ExecuteQueryWithIncrementalRetry` instead of ExecuteQuery to make your code handle throttling requests.

```c
public static void ExecuteQueryWithIncrementalRetry(this ClientContext clientContext, int retryCount, int delay)
{
  int retryAttempts = 0;
  int backoffInterval = delay;
  int retryAfterInterval = 0;
  bool retry = false;
  ClientRequestWrapper wrapper = null;
  if (retryCount <= 0)
    throw new ArgumentException("Provide a retry count greater than zero.");
  if (delay <= 0)
    throw new ArgumentException("Provide a delay greater than zero.");

  // Do while retry attempt is less than retry count
  while (retryAttempts < retryCount)
  {
    try
    {
      if (!retry)
      {
        clientContext.ExecuteQuery();
        return;
      }
      else
      {
        //increment the retry count
        retryAttempts++;

        // retry the previous request using wrapper
        if (wrapper != null && wrapper.Value != null)
        {
          clientContext.RetryQuery(wrapper.Value);
          return;
        }
        // retry the previous request as normal
        else
        {
          clientContext.ExecuteQuery();
          return;
        }
      }
    }
    catch (WebException ex)
    {
        var response = ex.Response as HttpWebResponse;
        // Check if request was throttled - http status code 429
        // Check is request failed due to server unavailable - http status code 503
        if (response != null && (response.StatusCode == (HttpStatusCode)429 || response.StatusCode == (HttpStatusCode)503))
        {
          wrapper = (ClientRequestWrapper)ex.Data["ClientRequest"];
          retry = true;

          // Determine the retry after value - use the `Retry-After` header when available
          string retryAfterHeader = response.GetResponseHeader("Retry-After");
          if (!string.IsNullOrEmpty(retryAfterHeader))
          {
            if (!Int32.TryParse(retryAfterHeader, out retryAfterInterval))
            {
              retryAfterInterval = backoffInterval;
            }
          }
          else
          {
            retryAfterInterval = backoffInterval;
            }

          // Delay for the requested seconds
          Thread.Sleep(retryAfterInterval * 1000);

          // Increase counters
          backoffInterval = backoffInterval * 2;
        }
        else
        {
          throw;
        }
    }
  }
  throw new MaximumRetryAttemptedException($"Maximum retry attempts {retryCount}, has be attempted.");
}

[Serializable]
public class MaximumRetryAttemptedException : Exception
{
  public MaximumRetryAttemptedException(string message) : base(message) { }
}
```