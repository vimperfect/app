<!-- TODO(not super important): Store steps in the URL so it's ok to refresh the page -->

<script lang="ts">
	import { Check, ChevronRight, Key } from '@lucide/svelte';

	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { ErrorCodes } from '$lib/errors';
	import { slideHorizontal } from '$lib/transitions/slide-horizontal';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { form, data }: PageProps = $props();

	let isSavingPublicKey = $state(false);
	let publicKey = $state('');

	let currentStep = $state(0);
	const steps = ['Welcome! 🎉', 'Setup a public key 🔐', 'Done! 😎'];
	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		}
	}

	onMount(() => {
		// No onboarding needed if the user already has a key
		if (data?.hasPublicKeys) {
			goto('/explore');
		}
	});
</script>

<div class="flex flex-col gap-5 w-full h-screen justify-center items-center">
	<div class="card bg-base-100 h-[400px] w-xl border-2 border-primary">
		<div class="flex mt-10 w-full items-center justify-center">
			<ul class="steps transition-all">
				{#each steps as step, i (i)}
					<li class="step" class:step-primary={i <= currentStep}>{step}</li>
				{/each}
			</ul>
		</div>
		<div class="overflow-x-hidden relative w-full h-full">
			{#key currentStep}
				<div
					in:slideHorizontal={{ direction: 'left' }}
					out:slideHorizontal={{ direction: 'right' }}
					class="absolute w-full top-0 left-0 h-full"
				>
					<div class="card-body justify-center items-center h-full">
						{#if currentStep === 0}
							<h1 class="text-3xl font-bold pt-3">Welcome to VIMperfect!</h1>
							<p class="text-lg text-center">
								Glad to see you here! Before you begin with exploring the available puzzles, there's
								a little setup required.
							</p>
						{:else if currentStep === 1}
							<form
								method="POST"
								class="flex flex-col items-center h-full justify-center"
								use:enhance={() => {
									// Introduce a little timout to avoid the loading spinner from flashing
									const loadingTimeout = setTimeout(() => {
										isSavingPublicKey = true;
									}, 100);

									return async ({ update }) => {
										clearTimeout(loadingTimeout);
										await update({ reset: false });
									};
								}}
							>
								<div class="flex w-full justify-center items-center gap-2">
									<label class="input my-3" class:input-error={form?.error}>
										<Key />
										<input
											disabled={form?.publicKeySaved}
											type="text"
											name="public_key"
											bind:value={publicKey}
											class="grow"
											placeholder="Your public key"
										/>
									</label>
									<button
										disabled={publicKey === '' || form?.publicKeySaved}
										onclick={(e) => form?.publicKeySaved && e.preventDefault()}
										class="btn btn-primary min-w-[100px]"
									>
										{#if isSavingPublicKey}
											<span class="loading loading-spinner"></span>
											Saving...
										{:else if form?.publicKeySaved}
											<Check />
											Saved
										{:else}
											Save
										{/if}
									</button>
								</div>

								<p class="text-md text-center">
									In order to access the playground and solve puzzles, you will need to provide an
									<!-- TODO: Create the page -->
									<a class="link" href="/help/public-keys">SSH public key</a>. This key will only be
									used to verify your identity.
									<br />
									Don't worry, this is perfectly safe, sharing your public key will not compromise your
									security.
								</p>
							</form>
						{:else if currentStep === 2}
							<h1 class="text-3xl font-bold pt-3">Ready, Set, Go! 🧑‍💻</h1>
							<p class="text-lg text-center">
								You are now ready to dive right into the world if vim keybindings with VIMperfect.
								You can explore the available puzzles by clicking the button below.
							</p>
						{/if}

						{#if currentStep == 2}
							<a href="/explore">
								<button class="btn btn-primary mt-5"> Explore puzzles </button>
							</a>
						{:else}
							<button
								class="btn btn-primary mt-5"
								onclick={nextStep}
								disabled={currentStep == 1 && !form?.publicKeySaved}
							>
								Next <ChevronRight />
							</button>
						{/if}
					</div>
				</div>
			{/key}
		</div>
	</div>

	<div
		role="alert"
		class="alert alert-error alert-outline transition-all"
		class:opacity-0={!form?.error}
	>
		<span>
			{#if form?.code === ErrorCodes.InvalidPublicKey}
				The public key is invalid.
			{:else if form?.code === ErrorCodes.PublicKeyAlreadyUsed}
				The public key is already used.
			{:else}
				Unknown error
			{/if}
		</span>
	</div>
</div>
