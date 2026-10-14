package com.example

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.print.PrintAttributes
import android.print.PrintManager
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView

class MainActivity : ComponentActivity() {

  private var fileUploadCallback: ValueCallback<Array<Uri>>? = null

  private val filePickerLauncher =
    registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
      if (result.resultCode == Activity.RESULT_OK) {
        val data = result.data
        val results: Array<Uri>? = when {
          data?.clipData != null -> {
            val count = data.clipData!!.itemCount
            Array(count) { i -> data.clipData!!.getItemAt(i).uri }
          }
          data?.data != null -> arrayOf(data.data!!)
          else -> null
        }
        fileUploadCallback?.onReceiveValue(results)
      } else {
        fileUploadCallback?.onReceiveValue(null)
      }
      fileUploadCallback = null
    }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()

    setContent {
      Surface(
        modifier = Modifier
          .fillMaxSize()
          .systemBarsPadding(),
        color = Color(0xFF0B0C0E)
      ) {
        AlfaStudioWebView(
          onOpenFileChooser = { callback, intent ->
            fileUploadCallback = callback
            try {
              filePickerLauncher.launch(intent)
            } catch (e: Exception) {
              callback.onReceiveValue(null)
              fileUploadCallback = null
            }
          },
          onPrintRequested = { webView ->
            runOnUiThread {
              val printManager = getSystemService(Context.PRINT_SERVICE) as? PrintManager
              val printAdapter = webView.createPrintDocumentAdapter("Alfa_Studio_Document")
              printManager?.print("Alfa_Studio_Document", printAdapter, PrintAttributes.Builder().build())
            }
          }
        )
      }
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun AlfaStudioWebView(
  onOpenFileChooser: (ValueCallback<Array<Uri>>, Intent) -> Unit,
  onPrintRequested: (WebView) -> Unit
) {
  val context = LocalContext.current
  val webView = remember {
    WebView(context).apply {
      layoutParams = ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      )
      setBackgroundColor(android.graphics.Color.parseColor("#0B0C0E"))

      settings.apply {
        javaScriptEnabled = true
        domStorageEnabled = true
        databaseEnabled = true
        allowFileAccess = true
        allowContentAccess = true
        loadWithOverviewMode = true
        useWideViewPort = true
        builtInZoomControls = true
        displayZoomControls = false
        cacheMode = WebSettings.LOAD_DEFAULT
      }

      // إضافة واجهة برمجية لـ Javascript للاستجابة لـ window.print()
      addJavascriptInterface(object {
        @JavascriptInterface
        fun printDocument() {
          post { onPrintRequested(this@apply) }
        }
      }, "AndroidHost")

      webViewClient = object : WebViewClient() {
        override fun shouldOverrideUrlLoading(
          view: WebView?,
          request: WebResourceRequest?
        ): Boolean {
          val url = request?.url?.toString() ?: return false
          if (url.startsWith("http://") || url.startsWith("https://")) {
            if (url.contains("wa.me") || url.contains("whatsapp")) {
              try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                context.startActivity(intent)
                return true
              } catch (_: Exception) {}
            }
          }
          return false
        }

        override fun onPageFinished(view: WebView?, url: String?) {
          super.onPageFinished(view, url)
          // إعادة توجيه دالة window.print في الصفحة إلى معالج أندرويد للطباعة
          view?.evaluateJavascript(
            """
            (function() {
              window.print = function() {
                if (window.AndroidHost && window.AndroidHost.printDocument) {
                  window.AndroidHost.printDocument();
                } else {
                  console.log('Printing triggered');
                }
              };
            })();
            """.trimIndent(),
            null
          )
        }
      }

      webChromeClient = object : WebChromeClient() {
        override fun onShowFileChooser(
          mWebView: WebView?,
          filePathCallback: ValueCallback<Array<Uri>>?,
          fileChooserParams: FileChooserParams?
        ): Boolean {
          if (filePathCallback == null) return false
          val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
            type = "image/*"
            addCategory(Intent.CATEGORY_OPENABLE)
          }
          onOpenFileChooser(filePathCallback, intent)
          return true
        }
      }

      loadUrl("file:///android_asset/index.html")
    }
  }

  // إدارة زر الرجوع
  val activity = context as? ComponentActivity
  DisposableEffect(activity, webView) {
    val backCallback = object : OnBackPressedCallback(true) {
      override fun handleOnBackPressed() {
        if (webView.canGoBack()) {
          webView.goBack()
        } else {
          // محاولة استدعاء العودة للـ hub إذا كان داخل محرر
          webView.evaluateJavascript(
            "if(typeof switchView === 'function') { switchView('hub'); }",
            null
          )
        }
      }
    }
    activity?.onBackPressedDispatcher?.addCallback(backCallback)
    onDispose {
      backCallback.remove()
      webView.destroy()
    }
  }

  AndroidView(
    factory = { webView },
    modifier = Modifier.fillMaxSize()
  )
}
