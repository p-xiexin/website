<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  import { Lock, X, Eye, EyeOff } from 'lucide-svelte';
  import { authStore } from '$lib/stores/auth';

  let { open = false } = $props<{ open: boolean }>();

  const dispatch = createEventDispatcher<{
    close: void;
    loggedin: void;
  }>();

  let accessCode = $state('');
  let error = $state('');
  let showPassword = $state(false);

  const resetState = () => {
    accessCode = '';
    error = '';
    showPassword = false;
  };

  const close = () => {
    resetState();
    dispatch('close');
  };

  const submit = () => {
    error = '';
    const success = authStore.login(accessCode);
    if (!success) {
      error = $t('ui.invalidCode');
      return;
    }
    dispatch('loggedin');
    close();
  };

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      close();
    }
  };

  const handleBackdropKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (event.target === event.currentTarget) {
        event.preventDefault();
        close();
      }
    }
  };

  $effect(() => {
    if (!open) resetState();
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    role="dialog"
    aria-modal="true"
    onclick={handleBackdropClick}
    tabindex="-1"
    onkeydown={handleBackdropKeydown}
  >
    <div class="relative w-full max-w-md rounded-2xl bg-card text-foreground shadow-2xl ring-1 ring-muted">
      <button
        class="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label={$t('ui.close')}
        onclick={close}
      >
        <X class="h-4 w-4" />
      </button>

      <div class="flex items-center gap-3 px-6 pt-6">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock class="h-5 w-5" />
        </div>
        <div>
          <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {$t('ui.previewing')}
          </p>
          <h3 class="text-lg font-semibold leading-6">{$t('ui.login')}</h3>
        </div>
      </div>

      {#if $authStore.isLoggedIn}
        <div class="px-6 pb-6 pt-4 text-sm text-muted-foreground">
          {$t('ui.alreadyLoggedIn')}
        </div>
        <div class="px-6 pb-6">
          <button
            class="inline-flex w-full items-center justify-center rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/80"
            onclick={() => {
              authStore.logout();
              dispatch('close');
            }}
          >
            {$t('ui.logout')}
          </button>
        </div>
      {:else}
        <div class="px-6 pb-2 pt-4 text-sm text-muted-foreground">
          {$t('ui.previewLoginDesc')}
        </div>
        <div class="px-6 text-xs text-muted-foreground">
          {$t('ui.previewDisclaimer')}
        </div>
        <div class="px-6 pb-6 space-y-3">
          <label class="block text-sm font-medium text-foreground">
            <div class="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                class="w-full rounded-lg border border-input bg-background px-3 py-2 pr-24 text-sm outline-none ring-primary/20 transition focus:ring-2"
                placeholder={$t('ui.accessCodePlaceholder')}
                bind:value={accessCode}
                autocomplete="off"
                onkeydown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    submit();
                  }
                }}
              />
              <button
                type="button"
                class="absolute inset-y-0 right-1 my-1 flex items-center rounded-md px-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                onclick={() => (showPassword = !showPassword)}
                aria-label={showPassword ? $t('ui.hide') : $t('ui.show')}
              >
                {#if showPassword}
                  <EyeOff class="h-4 w-4" />
                {:else}
                  <Eye class="h-4 w-4" />
                {/if}
              </button>
            </div>
          </label>

          {#if error}
            <p class="text-sm font-medium text-red-500">{error}</p>
          {/if}

          <button
            class="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            onclick={submit}
          >
            {$t('ui.unlockPreview')}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
